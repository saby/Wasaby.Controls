define('Controls/FormController', [
   'Core/Control',
   'Core/core-instance',
   'wml!Controls/FormController/FormController',
   'Core/Deferred',
   'Core/IoC'
], function(Control, cInstance, tmpl, Deferred, IoC) {
   'use strict';

   var _private = {
      checkRecordType: function(record) {
         return cInstance.instanceOfModule(record, 'WS.Data/Entity/Record');
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
            IoC.resolve('ILogger').error('FormController', 'Не смог прочитать запись ' + cfg.key, e);
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
         createDef.addCallback(function(record) {
            instance._setRecord(record);
            instance._createdInMounting = { isError: false, result: record };

            if (instance._isMount) {
               _private.createRecordBeforeMountNotify(instance);
            }
         });
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
      _beforeUpdate: function(cfg) {
         if (cfg.record && _private.checkRecordType(cfg.record)) {
            this._setRecord(cfg.record);
            if (cfg.isNewRecord) {
               this._isNewRecord = this._options.isNewRecord;
            }
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

         if (this._options.record && _private.checkRecordType(this._options.record)) {
            // уже установили в _beforeUpdate
         } else if (this._options.key !== undefined && this._options.key !== null) {
            // если нет рекорда и есть ключ - прочитаем рекорд
            this.read(this._options.key, this._options.readMetaData);
         } else {
            // если нет ни рекорда ни ключа - создадим рекорд
            this.create(this._options.initValues);
         }
      },
      _beforeUnmount: function() {
         this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);

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
            IoC.resolve('ILogger').error('FormController', 'Рекорд не является моделью и не задана опция idProperty, указывающая на ключевое поле рекорда');
            return;
         }

         return this._options.idProperty
            ? this._record.get(this._options.idProperty)
            : this._record.getId();
      },

      _tryDeleteNewRecord: function() {
         var def;
         if (this._isNewRecord && this._record) {
            var id = this._getRecordId();
            def = this._options.dataSource.destroy(id, this._options.destroyMeta);
            def.addBoth(function() {
               this._deletedId = id;
            }.bind(this));
         } else {
            def = new Deferred();
            def.callback();
         }
         return def;
      },
      _onPropertyChange: function() {
         if (!this._propertyChangeNotified) {
            var def = new Deferred();
            this._propertyChangedDef = def;
            var self = this;

            self._propertyChangeNotified = true;
            self._notify('registerPending', [def, {
               showLoadingIndicator: false,
               onPendingFail: function(forceFinishValue) {
                  if (self._record.isChanged()) {
                     self._showConfirmDialog(def, forceFinishValue);
                     def.addCallbacks(function(res) {
                        self._propertyChangeNotified = false;
                        return res;
                     }, function(e) {
                        self._propertyChangeNotified = false;
                        return e;
                     });
                  } else {
                     self._propertyChangeNotified = false;
                     def.callback(true);
                  }
                  return def;
               }
            }], { bubbling: true });
         }
      },
      _showConfirmDialog: function(def, forceFinishValue) {
         function updating(answer) {
            if (answer === true) {
               this.update().addCallbacks(function(res) {
                  if (!res.validationErrors) {
                     // если нет ошибок в валидации, просто завершаем пендинг с результатом
                     def.callback(res);
                  } else {
                     // если валидация не прошла, нам нужно оставить пендинг, но отменить ожидание завершения пендинга,
                     // чтобы оно не сработало, когда пендинг завершится.
                     // иначе попробуем закрыть панель, не получится, потом сохраним рекорд и панель закроется сама собой
                     this._notify('cancelFinishingPending', [], { bubbling: true });
                  }
                  return res;
               }.bind(this), function(e) {
                  def.errback(e);
                  return e;
               });
            } else if (answer === false) {
               def.callback(false);
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
               var confirmDef = self._children.popupOpener.open({
                  message: rk('Сохранить изменения?'),
                  details: rk('Чтобы продолжить редактирование, нажмите "Отмена".'),
                  type: 'yesnocancel'
               }).addCallback(function(answer) {
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
         res.addCallback(this._readHandler.bind(this));
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
               var res = self._children.crud.update(record, self._isNewRecord);
               var isChanged = self._record.isChanged();

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
