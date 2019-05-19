import Control = require('Core/Control');
import cInstance = require('Core/core-instance');
import tmpl = require('wml!Controls/_form/FormController/FormController');
import Deferred = require('Core/Deferred');
import Env = require('Env/Env');
import dataSource = require('Controls/dataSource');


   /**
    * Record editing controller. The control stores data about the record and can execute queries CRUD methods on the BL.
    * @category FormController
    * @class Controls/_form/FormController
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IFormController
    * @demo Controls-demo/Popup/Edit/Opener
    * @control
    * @public
    * @author Красильников А.С.
    */


   /**
    * Object with state from server side rendering
    * @typedef {Object}
    * @name ReceivedState
    * @property {*} [data]
    * @property {Controls/_dataSource/_error/ViewConfig} [errorConfig]
    */

   /**
    * @typedef {Object}
    * @name CrudResult
    * @property {*} [data]
    * @property {Controls/_dataSource/_error/ViewConfig} [errorConfig]
    * @property {Controls/_dataSource/_error/ViewConfig} [error]
    */

   /**
    * Удаляет оригинал ошибки из CrudResult перед вызовом сриализатора состояния,
    * который не сможет нормально разобрать/собрать экземпляр случайной ошибки
    * @param {CrudResult} crudResult
    * @return {ReceivedState}
    */
   var getState = function(crudResult) {
      delete crudResult.error;
      return crudResult;
   };


   /**
    * getting result from <CrudResult> wrapper
    * @param {CrudResult} [crudResult]
    * @return {Promise}
    */
   var getData = function(crudResult) {
      if (!crudResult) {
         return Promise.resolve();
      }
      if (crudResult.data) {
         return Promise.resolve(crudResult.data);
      }
      return Promise.reject(crudResult.error);
   };

   var _private = {
      checkRecordType: function(record) {
         return cInstance.instanceOfModule(record, 'Types/entity:Record');
      },
      readRecordBeforeMount: function(instance, cfg) {
         // если в опции не пришел рекорд, смотрим на ключ key, который попробуем прочитать
         // в beforeMount еще нет потомков, в частности _children.crud, поэтому будем читать рекорд напрямую
         return instance._source.read(cfg.key, cfg.readMetaData).then(function(record) {
            instance._setRecord(record);
            instance._readInMounting = { isError: false, result: record };

            if (instance._isMount) {
               _private.readRecordBeforeMountNotify(instance);
            }

            return {
               data: record
            };
         }, function(e) {
            Env.IoC.resolve('ILogger').error('FormController', 'Не смог прочитать запись ' + cfg.key, e);
            instance._readInMounting = { isError: true, result: e };
            return instance._processError(e).then(getState);
         });
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
         return instance._source.create(cfg.initValues || cfg.createMetaData).then(function(record) {
            instance._setRecord(record);
            instance._createdInMounting = { isError: false, result: record };

            if (instance._isMount) {
               _private.createRecordBeforeMountNotify(instance);
            }
            return {
               data: record
            };
         }, function(e) {
            instance._createdInMounting = { isError: true, result: e };
            return instance._processError(e).then(getState);
         });
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
      }
   };

   var FormController = Control.extend({
      _template: tmpl,
      _record: null,
      _isNewRecord: false,

      constructor: function(options) {
         FormController.superclass.constructor.apply(this, arguments);
         options = options || {};
         this.__errorController = options.errorController || new dataSource.error.Controller({});
      },
      _beforeMount: function(cfg, _, receivedState) {
         this._source = cfg.source || cfg.dataSource;
         if (cfg.dataSource) {
            Env.IoC.resolve('ILogger').warn('FormController', 'Use option "source" instead of "dataSource"');
         }
         if (cfg.initValues) {
            Env.IoC.resolve('ILogger').warn('FormController', 'Use option "createMetaData" instead of "initValues"');
         }
         if (cfg.destroyMeta) {
            Env.IoC.resolve('ILogger').warn('FormController', 'Use option "destroyMetaData " instead of "destroyMeta"');
         }
         if (cfg.idProperty) {
            Env.IoC.resolve('ILogger').warn('FormController', 'Use option "keyProperty " instead of "idProperty"');
         }

         receivedState = receivedState || {};
         var receivedError = receivedState.errorConfig;
         var receivedData = receivedState.data;

         if (receivedError) {
            return this._showError(receivedError);
         }
         var record = receivedData || cfg.record;

         // use record
         if (record && _private.checkRecordType(record)) {
            this._setRecord(record);
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
         this._createChangeRecordPending();
         this._isMount = true;
      },
      _beforeUpdate: function(newOptions) {
         if (newOptions.dataSource || newOptions.source) {
            this._source = newOptions.source || newOptions.dataSource;
         }
         if (newOptions.hasOwnProperty('isNewRecord')) {
            this._isNewRecord = newOptions.isNewRecord;
         }
         if (newOptions.record && this._options.record !== newOptions.record) {
            this._setRecord(newOptions.record);
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
            this.create(newOptions.initValues || newOptions.createMetaData);
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
         // when FormController destroying, its need to check new record was saved or not. If its not saved, new record trying to delete.
         this._tryDeleteNewRecord();
      },
      _setRecord: function(record) {
         if (!record || _private.checkRecordType(record)) {
            this._record = record;
         }
      },
      _getRecordId: function() {
         if (!this._record.getId && !this._options.idProperty && !this._options.keyProperty) {
            Env.IoC.resolve('ILogger').error('FormController', 'Рекорд не является моделью и не задана опция idProperty, указывающая на ключевое поле рекорда');
            return null;
         }
         var keyProperty = this._options.idProperty || this._options.keyProperty;
         return keyProperty ? this._record.get(keyProperty) : this._record.getId();
      },

      _tryDeleteNewRecord: function() {
         if (this._needDestroyRecord()) {
            return this._source.destroy(this._getRecordId(), this._options.destroyMeta || this._options.destroyMetaData);
         }
         return (new Deferred()).callback();
      },
      _needDestroyRecord: function() {
         // Destroy record when:
         // 1. The record obtained by the method "create"
         // 2. The "create" method returned the key
         return this._record && this._isNewRecord && this._getRecordId();
      },

      _createChangeRecordPending: function() {
         var self = this;
         self._notify('registerPending', [new Deferred(), {
            showLoadingIndicator: false,
            validate: function() {
               return self._record && self._record.isChanged();
            },
            onPendingFail: function(forceFinishValue, deferred) {
               self._showConfirmDialog(deferred, forceFinishValue);
            }
         }], { bubbling: true });
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

      create: function(createMetaData) {
         createMetaData = createMetaData || this._options.initValues || this._options.createMetaData;
         return this._children.crud.create(createMetaData).addCallbacks(
            this._createHandler.bind(this),
            this._crudErrback.bind(this)
         );
      },
      _createHandler: function(record) {
         // when FormController create record, its need to check previous record was saved or not.
         // If its not saved but was created, previous record trying to delete.
         var deleteDef = this._tryDeleteNewRecord();
         deleteDef.addBoth(function() {
            this._updateIsNewRecord(true);
            this._wasCreated = true;
            this._forceUpdate();
         }.bind(this));
         return record;
      },
      read: function(key, readMetaData) {
         readMetaData = readMetaData || this._options.readMetaData;
         return this._children.crud.read(key, readMetaData).addCallbacks(
            this._readHandler.bind(this),
            this._crudErrback.bind(this)
         );
      },
      _readHandler: function(record) {
         // when FormController read record, its need to check previous record was saved or not.
         // If its not saved but was created, previous record trying to delete.
         var deleteDef = this._tryDeleteNewRecord();
         deleteDef.addBoth(function() {
            this._wasRead = true;
            this._updateIsNewRecord(false);
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
               var res = self._update().addCallback(getData);
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

               // fake deferred used for code refactoring
               if (!(res && res.addCallback)) {
                  res = new Deferred();
                  res.callback();
               }
               res.addCallback(function(arg) {
                  self._updateIsNewRecord(false);

                  updateDef.callback({ data: true });
                  return arg;
               });
               res.addErrback((error: Error) => {
                  updateDef.errback(error);
                  return self._processError(error, dataSource.error.Mode.dialog);
               });
            } else {
               // если были ошибки валидации, уведомим о них
               var validationErrors = self._children.validation.isValid();
               self._notify('validationFailed', [validationErrors], { bubbling: true });
               updateDef.callback({
                  data: {
                     validationErrors: validationErrors
                  }
               });
            }
         });
         validationDef.addErrback(function(e) {
            updateDef.errback(e);
            return e;
         });
         return updateDef;
      },
      delete: function(destroyMetaData) {
         destroyMetaData = destroyMetaData || this._options.destroyMeta || this._options.destroyMetaData;
         var self = this;
         var resultDef = this._children.crud.delete(this._record, destroyMetaData);

         resultDef.addCallbacks(function(record) {
            self._setRecord(null);
            self._wasDestroyed = true;
            self._updateIsNewRecord(false);
            self._forceUpdate();
            return record;
         }, function(error) {
            return self._crudErrback(error, dataSource.error.Mode.dialog);
         });
         return resultDef;
      },

      validate: function() {
         return this._children.validation.submit();
      },

      /**
       *
       * @param {Error} error
       * @param {Controls/_dataSource/_error/Mode} [mode]
       * @return {Promise<*>}
       * @private
       */
      _crudErrback: function(error, mode) {
         return this._processError(error, mode).then(getData);
      },

      _updateIsNewRecord: function(value) {
         if (this._isNewRecord !== value) {
            this._isNewRecord = value;
            this._notify('isNewRecordChanged', [value]);
         }
      },

      /**
       * @param {Error} error
       * @param {Controls/_dataSource/_error/Mode} [mode]
       * @return {Promise.<CrudResult>}
       * @private
       */
      _processError: function(error, mode) {
         var self = this;
         return self.__errorController.process({
            error: error,
            mode: mode || dataSource.error.Mode.include
         }).then(function(errorConfig) {
            self._showError(errorConfig);
            return {
               error: error,
               errorConfig: errorConfig
            };
         });
      },

      /**
       * @private
       */
      _showError: function(errorConfig) {
         this.__error = errorConfig;
         this._forceUpdate();
      },

      _hideError: function() {
         if (this.__error) {
            this.__error = null;
            this._forceUpdate();
         }
      },

      _onCloseErrorDialog: function() {
         if (!this._record) {
            this._notify('close', [], { bubbling: true });
         }
      },

      _crudHandler: function(event) {
         var eventName = event.type;
         var args = Array.prototype.slice.call(arguments, 1);
         this._notifyHandler(eventName, args);
      },

      _notifyHandler: function(eventName, args) {
         this._notifyToOpener(eventName, args);
         this._notify(eventName, args, { bubbling: true });
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
   export = FormController;

