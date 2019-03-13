define('Controls/FormController', [
   'Core/Control',
   'Core/core-instance',
   'wml!Controls/FormController/FormController',
   'Core/Deferred',
   'Env/Env',
   'Controls/Utils/error/Mode',
   'Controls/Utils/ErrorController'
], function(Control, cInstance, tmpl, Deferred, Env, ErrorMode, ErrorController) {
   'use strict';

   var _private = {
      checkRecordType: function(record) {
         return cInstance.instanceOfModule(record, 'Types/entity:Record');
      },
      readRecordBeforeMount: function(instance, cfg) {
         // если в опции не пришел рекорд, смотрим на ключ key, который попробуем прочитать
         // в beforeMount еще нет потомков, в частности _children.crud, поэтому будем читать рекорд напрямую
         var readDef = cfg.dataSource.read(cfg.key, cfg.readMetaData);

         readDef.addCallback(function(record) {
            instance._setRecord(record);
            instance._readInMounting = { isError: false, result: record };

            if (instance._isMount) {
               _private.readRecordBeforeMountNotify(instance);
            }

            return record;
         });
         readDef.addErrback(function(e) {
            Env.IoC.resolve('ILogger').error('FormController', 'Не смог прочитать запись ' + cfg.key, e);
            instance._record && instance._record.unsubscribe('onPropertyChange', instance._onPropertyChangeHandler);
            instance._readInMounting = { isError: true, result: e };
            throw e;
         });

         return readDef;
      },
      readRecordBeforeMountNotify: function(instance) {
         if (!instance._readInMounting.isError) {
            instance._notifyHandler('readSuccessed', [instance._readInMounting.result]);

            // перерисуемся
            instance._readHandler(instance._record);
         } else {
            instance._notifyHandler('readFailed', [instance._readInMounting.result]);
         }
         instance._readInMounting = null;
      },

      createRecordBeforeMount: function(instance, cfg) {
         // если ни рекорда, ни ключа, создаем новый рекорд и используем его
         // в beforeMount еще нет потомков, в частности _children.crud, поэтому будем создавать рекорд напрямую
         var createDef = cfg.dataSource.create(cfg.initValues);
         instance._record && instance._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
         createDef.addCallbacks(function(record) {
            instance._setRecord(record);
            instance._createdInMounting = { isError: false, result: record };

            if (instance._isMount) {
               _private.createRecordBeforeMountNotify(instance);
            }
         }, instance._crudErrback.bind(instance));
         createDef.addErrback(function(e) {
            instance._createdInMounting = { isError: true, result: e };
            return e;
         });
         return createDef;
      },

      createRecordBeforeMountNotify: function(instance) {
         if (!instance._createdInMounting.isError) {
            instance._notifyHandler('createSuccessed', [instance._createdInMounting.result]);

            // зарегистрируем пендинг, перерисуемся
            instance._createHandler(instance._record);
         } else {
            instance._notifyHandler('createFailed', [instance._createdInMounting.result]);
         }
         instance._createdInMounting = null;
      },
   };

   /**
    * @name Controls/FormController#initValues
    * @cfg {Object} initial values what will be argument of create method called when key option and record option are not exist.
    * Also its default value for read method.
    */
   /**
    * @name Controls/FormController#readMetaData
    * @cfg {Object} Additional meta data what will be argument of read method called when key option is exists.
    * Also its default value for read method.
    */
   /**
    * @name Controls/FormController#destroyMeta
    * @cfg {Object} Additional meta data what will be argument of destroying of draft record.
    * Also its default value for destroy method.
    */

   var FormController = Control.extend({
      _template: tmpl,
      _record: null,
      _isNewRecord: false,

      constructor: function(options) {
         FormController.superclass.constructor.apply(this, arguments);
         options = options || {};
         this.__errorController = options.errorController || new ErrorController({});
      },
      _beforeMount: function(cfg) {
         this._onPropertyChangeHandler = this._onPropertyChange.bind(this);

         // use record
         if (cfg.record && _private.checkRecordType(cfg.record)) {
            this._setRecord(cfg.record);
            this._isNewRecord = !!cfg.isNewRecord;

            // If there is a key - read the record. Not waiting for answer BL
            if (cfg.key !== undefined && cfg.key !== null) {
               _private.readRecordBeforeMount(this, cfg);
            }
         } else if (cfg.key !== undefined && cfg.key !== null) {
            return _private.readRecordBeforeMount(this, cfg);
         } else {
            return _private.createRecordBeforeMount(this, cfg);
         }
      },
      _afterMount: function() {
         // если рекорд был создан во время beforeMount, уведомим об этом
         if (this._createdInMounting) {
            _private.createRecordBeforeMountNotify(this);
         }

         // если рекорд был прочитан через ключ во время beforeMount, уведомим об этом
         if (this._readInMounting) {
            _private.readRecordBeforeMountNotify(this);
         }
         this._isMount = true;
      },
      _beforeUpdate: function(newOptions) {
         if (newOptions.record && this._options.record !== newOptions.record) {
            this._setRecord(newOptions.record);

            // todo: https://online.sbis.ru/opendoc.html?guid=2095997b-49b3-4859-9e24-890cdc685a24
            if (newOptions.isNewRecord !== undefined) {
               this._isNewRecord = newOptions.isNewRecord;
            }
         }
         if (newOptions.key !== undefined && this._options.key !== newOptions.key) {
            var self = this;
            if (newOptions.record && newOptions.record.isChanged()) {
               this._showConfirmPopup('yesno').addCallback(function(answer) {
                  if (answer === true) {
                     self.update().addCallback(function(res) {
                        self.read(newOptions.key, newOptions.readMetaData);
                        return res;
                     });
                  } else {
                     self.read(newOptions.key, newOptions.readMetaData);
                  }
               });
            } else {
               self.read(newOptions.key, newOptions.readMetaData);
            }

         }
         if (newOptions.key === undefined && !newOptions.record) {
            this.create(newOptions.initValues);
         }
      },
      _afterUpdate: function() {
         if (this._wasCreated || this._wasRead || this._wasDestroyed) {
            // сбрасываем результат валидации, если только произошло создание, чтение или удаление рекорда
            this._children.validation.setValidationResult(null);
            this._wasCreated = false;
            this._wasRead = false;
            this._wasDestroyed = false;
         }
      },
      _beforeUnmount: function() {
         this._setRecord(null);

         // when FormController destroying, its need to check new record was saved or not. If its not saved, new record trying to delete.
         this._tryDeleteNewRecord();
      },
      _setRecord: function(record) {
         if (!record || _private.checkRecordType(record)) {
            this._record && this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
            this._record = record;
            this._record && this._record.subscribe('onPropertyChange', this._onPropertyChangeHandler);
         }
      },
      _getRecordId: function() {
         if (!this._record.getId && !this._options.idProperty) {
            Env.IoC.resolve('ILogger').error('FormController', 'Рекорд не является моделью и не задана опция idProperty, указывающая на ключевое поле рекорда');
            return;
         }

         return this._options.idProperty
            ? this._record.get(this._options.idProperty)
            : this._record.getId();
      },

      _tryDeleteNewRecord: function() {
         if (this._needDestroyRecord()) {
            return this._options.dataSource.destroy(this._getRecordId(), this._options.destroyMeta);
         }
         return (new Deferred()).callback();
      },
      _needDestroyRecord: function() {
         // Destroy record when:
         // 1. The record obtained by the method "create"
         // 2. The "create" method returned the key
         return this._record && this._isNewRecord && this._getRecordId();
      },
      _onPropertyChange: function() {
         var self = this;
         if (!this._propertyChangeNotified && this._record.isChanged()) {
            var def = new Deferred();
            this._propertyChangedDef = def;

            self._propertyChangeNotified = true;
            self._notify('registerPending', [def, {
               showLoadingIndicator: false,
               validate: function() {
                  return self._record.isChanged();
               },
               onPendingFail: function(forceFinishValue, deferred) {
                  self._showConfirmDialog(deferred, forceFinishValue);
                  deferred.addCallbacks(function(res) {
                     self._propertyChangeNotified = false;
                     return res;
                  }, function(e) {
                     self._propertyChangeNotified = false;
                     return e;
                  });
               }
            }], { bubbling: true });
         }

         // if record actually is not changed after onPropertyChange, we must resolve pending
         if (this._propertyChangeNotified && !this._record.isChanged()) {
            if (!self._propertyChangedDef.isReady()) {
               this._propertyChangedDef.callback(true);
            }

            // сбрасываем флаг об изменении, потому что отстрелили callback и теперь надо будет заново создавать deferred
            this._propertyChangeNotified = false;
         }
      },
      _showConfirmDialog: function(def, forceFinishValue) {
         function updating(answer) {
            if (answer === true) {
               this.update().addCallbacks(function(res) {
                  if (!res.validationErrors) {
                     // если нет ошибок в валидации, просто завершаем пендинг с результатом
                     if (!def.isReady()) {
                        def.callback(res);
                     }
                  } else {
                     // если валидация не прошла, нам нужно оставить пендинг, но отменить ожидание завершения пендинга,
                     // чтобы оно не сработало, когда пендинг завершится.
                     // иначе попробуем закрыть панель, не получится, потом сохраним рекорд и панель закроется сама собой
                     this._notify('cancelFinishingPending', [], { bubbling: true });
                  }
                  return res;
               }.bind(this), function(e) {
                  if (!def.isReady()) {
                     def.errback(e);
                  }
                  return e;
               });
            } else if (answer === false) {
               if (!def.isReady()) {
                  def.callback(false);
               }
            }
         }

         if (forceFinishValue !== undefined) {
            updating.call(this, !!forceFinishValue);
         } else {
            var self = this;

            // если окошко уже было показано другим пендингом, просто ждем результата окна, не показываем новое
            if (this._confirmDef) {
               this._confirmDef.addCallback(function(answer) {
                  self._confirmDef = null;
                  updating.call(self, answer);
               }).addErrback(function(e) {
                  self._confirmDef = null;
                  return e;
               });
            } else {
               var confirmDef = self._showConfirmPopup('yesnocancel', rk('Чтобы продолжить редактирование, нажмите "Отмена".')).addCallback(function(answer) {
                  self._confirmDef = null;
                  updating.call(self, answer);
                  return answer;
               }).addErrback(function(e) {
                  self._confirmDef = null;
                  return e;
               });
               this._confirmDef = confirmDef;
               return confirmDef;
            }
         }
      },

      _showConfirmPopup: function(type, details) {
         return this._children.popupOpener.open({
            message: rk('Сохранить изменения?'),
            details: details,
            type: type
         });
      },

      create: function(initValues) {
         initValues = initValues || this._options.initValues;
         var res = this._children.crud.create(initValues);
         res.addCallback(this._createHandler.bind(this));
         return res;
      },
      _createHandler: function(record) {
         // when FormController create record, its need to check previous record was saved or not.
         // If its not saved but was created, previous record trying to delete.
         var deleteDef = this._tryDeleteNewRecord();
         deleteDef.addBoth(function() {
            this._isNewRecord = true;
            this._wasCreated = true;
            this._forceUpdate();
         }.bind(this));
         return record;
      },
      read: function(key, readMetaData) {
         readMetaData = readMetaData || this._options.readMetaData;
         var res = this._children.crud.read(key, readMetaData);
         res.addCallbacks(
            this._readHandler.bind(this),
            this._crudErrback.bind(this)
         );
         return res;
      },
      _readHandler: function(record) {
         // when FormController read record, its need to check previous record was saved or not.
         // If its not saved but was created, previous record trying to delete.
         var deleteDef = this._tryDeleteNewRecord();
         deleteDef.addBoth(function() {
            this._wasRead = true;
            this._isNewRecord = false;
            this._forceUpdate();
         }.bind(this));
         this._hideError();
         return record;
      },

      update: function() {
         var updateResult = new Deferred(),
            self = this;

         function updateCallback(result) {
            // if result is true, custom update called and we dont need to call original update.
            if (result !== true) {
               var res = self._update();
               updateResult.dependOn(res);
            } else {
               updateResult.callback(true);
            }
         }

         // maybe anybody want to do custom update. check it.
         var result = this._notify('requestCustomUpdate', [], { bubbling: true });

         // pending waiting while update process finished
         var def = new Deferred();
         self._notify('registerPending', [def, { showLoadingIndicator: false }], { bubbling: true });
         def.dependOn(updateResult);

         if (result && result.then) {
            result.then(function(defResult) {
               updateCallback(defResult);
               return defResult;
            }, function(err) {
               updateResult.errback(err);
               return err;
            });
         } else {
            updateCallback(result);
         }
         return updateResult;
      },
      _update: function() {
         var self = this,
            record = this._record,
            updateDef = new Deferred();

         // запускаем валидацию
         var validationDef = this._children.validation.submit();
         validationDef.addCallback(function(results) {
            var isError = Object.keys(results).find(function(key) {
               return Array.isArray(results[key]);
            });
            if (!isError) {
               // при успешной валидации пытаемся сохранить рекорд
               self._notify('validationSuccessed', [], { bubbling: true });
               var isChanged = self._record.isChanged();
               var res = self._children.crud.update(record, self._isNewRecord);

               // fake deferred used for code refactoring
               if (!(res && res.addCallback)) {
                  res = new Deferred();
                  res.callback();
               }
               res.addCallback(function(arg) {
                  if (isChanged && !self._propertyChangedDef.isReady()) {
                     // если редактируемый рекорд и сохранение вызвано не из окна сохранения, завершаем пендинг
                     // если из окна сохранения, пендинг завершится там
                     self._propertyChangedDef.callback(true);
                     self._propertyChangeNotified = false;
                  }
                  self._isNewRecord = false;

                  updateDef.callback(true);
                  return arg;
               });
               res.addErrback(function(e) {
                  updateDef.errback(e);
                  return e;
               });
            } else {
               // если были ошибки валидации, уведомим о них
               var validationErrors = self._children.validation.isValid();
               self._notify('validationFailed', [validationErrors], { bubbling: true });
               updateDef.callback({
                  validationErrors: validationErrors
               });
            }
         });
         validationDef.addErrback(function(e) {
            updateDef.errback(e);
            return e;
         });
         return updateDef;
      },
      delete: function(destroyMeta) {
         destroyMeta = destroyMeta || this._options.destroyMeta;
         var self = this;
         var record = this._record;
         var resultDef = this._children.crud.delete(record, destroyMeta);

         resultDef.addCallback(function(record) {
            self._setRecord(null);
            self._wasDestroyed = true;
            self._isNewRecord = false;
            self._forceUpdate();
            return record;
         });
         return resultDef;
      },

      /**
       * Starts validating process.
       * @returns {Core/Deferred} deferred of result of validation
       */
      validate: function() {
         return this._children.validation.submit();
      },

      _crudErrback: function(error) {
         var errorTemplate = this.__errorController.process({
            error: error,
            mode: ErrorMode.include
         });
         if (!errorTemplate) {
            return;
         }
         return this._showError(errorTemplate);
      },
      _showError: function(config) {
         if (config.mode != ErrorMode.dialog) {
            // отрисовка внутри компонента
            this.__error = config;
            this._forceUpdate();
            return;
         }

         // диалоговое с ошибкой
         this._children.dialogOpener.open({
            template: config.template,
            templateOptions: config.options
         });
      },
      _hideError: function() {
         if (this.__error) {
            this.__error = null;
            this._forceUpdate();
         }
         if (
            this._children &&
            this._children.dialogOpener &&
            this._children.dialogOpener.isOpened()
         ) {
            this._children.dialogOpener.close();
         }
      },
      _crudHandler: function(event) {
         var eventName = event.type;
         var args = Array.prototype.slice.call(arguments, 1);
         this._notifyHandler(eventName, args);
      },

      _notifyHandler: function(eventName, args) {
         this._notify(eventName, args, { bubbling: true });
         this._notifyToOpener(eventName, args);
      },

      _notifyToOpener: function(eventName, args) {
         var handlers = {
            'updatesuccessed': '_getUpdateSuccessedData',
            'createsuccessed': '_getCreateSuccessedData',
            'readsuccessed': '_getReadSuccessedData',
            'deletesuccessed': '_getDeleteSuccessedData'
         };
         var resultDataHandlerName = handlers[eventName.toLowerCase()];
         if (this[resultDataHandlerName]) {
            var resultData = this[resultDataHandlerName].apply(this, args);
            this._notify('sendResult', [resultData], { bubbling: true });
         }
      },

      _getUpdateSuccessedData: function(record, key) {
         var additionalData = {
            key: key,
            isNewRecord: this._isNewRecord
         };
         return this._getResultData('update', record, additionalData);
      },

      _getDeleteSuccessedData: function(record) {
         return this._getResultData('delete', record);
      },

      _getCreateSuccessedData: function(record) {
         return this._getResultData('create', record);
      },

      _getReadSuccessedData: function(record) {
         return this._getResultData('read', record);
      },
      _getResultData: function(eventName, record, additionalData) {
         return {
            formControllerEvent: eventName,
            record: record,
            additionalData: additionalData || {}
         };
      }
   });

   FormController._private = _private;
   return FormController;
});
