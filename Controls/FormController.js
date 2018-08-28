define('Controls/FormController', [
   'Core/Control',
   'tmpl!Controls/FormController/FormController',
   'WS.Data/Entity/Model',
   'Core/Deferred',
   'Core/IoC'
], function(Control, tmpl, Model, Deferred, IoC) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      _record: null,

      _beforeMount: function(cfg) {
         this._onPropertyChangeHandler = this._onPropertyChange.bind(this);

         var self = this;

         // если в опции пришел рекорд, используем его
         if (cfg.record && cfg.record instanceof Model) {
            this._record && this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
            this._record = cfg.record;

            // на изменение рекорда регистрируем пендинг
            this._record.subscribe('onPropertyChange', this._onPropertyChangeHandler);
            if (cfg.isNewRecord) {
               this._isNewRecord = cfg.isNewRecord;
            }
         } else if (cfg.key !== undefined && cfg.key !== null) {
            // если в опции не пришел рекорд, смотрим на ключ key, который попробуем прочитать
            // в beforeMount еще нет потомков, в частности _children.crud, поэтому будем читать рекорд напрямую
            var readDef = cfg.dataSource.read(cfg.key);
            readDef.addCallback(function(record) {
               self._record && self._record.unsubscribe('onPropertyChange', self._onPropertyChangeHandler);
               self._record = record;

               // на изменение рекорда регистрируем пендинг
               self._record.subscribe('onPropertyChange', self._onPropertyChangeHandler);
               self._readInMounting = { isError: false, result: record };
               return record;
            });
            readDef.addErrback(function(e) {
               IoC.resolve('ILogger').error('FormController', 'Не смог прочитать запись ' + cfg.key, e);
               self._record && self._record.unsubscribe('onPropertyChange', self._onPropertyChangeHandler);
               self._readInMounting = { isError: true, result: e };
               throw e;
            });
            return readDef;
         } else {
            // если ни рекорда, ни ключа, создаем новый рекорд и используем его
            // в beforeMount еще нет потомков, в частности _children.crud, поэтому будем создавать рекорд напрямую
            self._record && this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
            var createDef = cfg.dataSource.create();
            createDef.addCallback(function(record) {
               self._record = record;

               // на изменение рекорда регистрируем пендинг
               self._record.subscribe('onPropertyChange', self._onPropertyChangeHandler);
               self._createdInMounting = { isError: false, result: record };
            });
            createDef.addErrback(function(e) {
               self._createdInMounting = { isError: true, result: e };
               return e;
            });
            return createDef;
         }
      },
      _afterMount: function() {
         // если рекорд был создан во время beforeMount, уведомим об этом
         if (this._createdInMounting) {
            if (!this._createdInMounting.isError) {
               this._notify('createSuccessed', [this._createdInMounting.result], { bubbling: true });

               // зарегистрируем пендинг, перерисуемся
               this._createHandler(this._record);
            } else {
               this._notify('createFailed', [this._createdInMounting.result], { bubbling: true });
            }
            this._createdInMounting = null;
         }

         // если рекорд был прочитан через ключ во время beforeMount, уведомим об этом
         if (this._readInMounting) {
            if (!this._readInMounting.isError) {
               this._notify('readSuccessed', [this._readInMounting.result], { bubbling: true });

               // перерисуемся
               this._readHandler(this._record);
            } else {
               this._notify('readFailed', [this._readInMounting.result], { bubbling: true });
            }
            this._readInMounting = null;
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

         if (this._options.record && this._options.record instanceof Model) {
            // если есть рекорд - используем его
            this._record && this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
            this._record = this._options.record;
            this._record.subscribe('onPropertyChange', this._onPropertyChangeHandler);
            if (this._options.isNewRecord) {
               this._isNewRecord = this._options.isNewRecord;
            }
         } else if (this._options.key !== undefined && this._options.key !== null) {
            // если нет рекорда и есть ключ - прочитаем рекорд
            this.read(this._options.key);
         } else {
            // если нет ни рекорда ни ключа - создадим рекорд
            this.create();
         }
      },
      _beforeUnmount: function() {
         this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);

         // when FormController destroying, its need to check new record was saved or not. If its not saved, new record trying to delete.
         this._tryDeleteNewRecord();
      },
      _tryDeleteNewRecord: function() {
         var def;
         if (this._isNewRecord && this._record) {
            def = this._options.dataSource.destroy(this._record.getId());
         } else {
            def = new Deferred();
            def.callback();
         }
         return def;
      },
      _onPropertyChange: function(event, fields) {
         if (!this._propertyChangeNotified) {
            var def = new Deferred();
            this._propertyChangedDef = def;
            var self = this;

            self._propertyChangeNotified = true;
            self._notify('registerPending', [def, {
               showLoadingIndicator: false,
               onPendingFail: function() {
                  self._showConfirmDialog(def);
                  def.addCallbacks(function(res) {
                     self._propertyChangeNotified = false;
                     return res;
                  }, function(e) {
                     self._propertyChangeNotified = false;
                     return e;
                  });
                  return def;
               }
            }], { bubbling: true });
         }
      },
      _showConfirmDialog: function(def) {
         function updating(answer) {
            if (answer === true) {
               this._updateByPopup = true;
               this.update().addCallbacks(function(res) {
                  this._updateByPopup = false;
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
                  this._updateByPopup = false;
                  def.callback(false);
                  return e;
               }.bind(this));
            } else if (answer === false) {
               def.callback(false);
            }
         }

         // todo реализовать иначе, чтобы в тесте можно было просто подменить фукнкцию
         if (this.hasOwnProperty('__$resultForTests')) {
            updating.call(this, this.__$resultForTests);
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
         var res = this._children.crud.create(initValues);
         res.addCallback(this._createHandler.bind(this));
         return res;
      },
      _createHandler: function(record) {
         this._isNewRecord = true;

         var def = new Deferred();
         this._createPendingDef = def;

         var self = this;
         this._notify('registerPending', [def, {
            showLoadingIndicator: false,
            onPendingFail: function() {
               self._showConfirmDialog(def);
               return def;
            }
         }], { bubbling: true });

         this._wasCreated = true;
         this._forceUpdate();
         return record;
      },
      read: function(key, readMetaData) {
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
               if (res instanceof Deferred) {
                  res.addCallback(function(record) {
                     if (self._isNewRecord && !self._updateByPopup) {
                        // если созданный рекорд и сохранение вызвано не из окна сохранения, завершаем пендинг
                        // если из окна сохранения, пендинг завершится там
                        self._createPendingDef.callback(true);
                     }
                     if (isChanged && !self._updateByPopup) {
                        // если редактируемый рекорд и сохранение вызвано не из окна сохранения, завершаем пендинг
                        // если из окна сохранения, пендинг завершится там
                        self._propertyChangedDef.callback(true);
                     }
                     self._isNewRecord = false;

                     updateDef.callback(true);
                     return record;
                  });
                  res.addErrback(function(e) {
                     updateDef.errback(e);
                     return e;
                  });
               } else {
                  if (self._isNewRecord && !self._updateByPopup) {
                     // если созданный рекорд и сохранение вызвано не из окна сохранения, завершаем пендинг
                     // если из окна сохранения, пендинг завершится там
                     self._createPendingDef.callback(true);
                  }
                  if (isChanged && !self._updateByPopup) {
                     // если редактируемый рекорд и сохранение вызвано не из окна сохранения, завершаем пендинг
                     // если из окна сохранения, пендинг завершится там
                     self._propertyChangedDef.callback(true);
                  }
                  self._isNewRecord = false;
                  updateDef.callback(true);
               }
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
         var self = this;
         var record = this._record;
         var resultDef = this._children.crud.delete(record, destroyMeta);

         resultDef.addCallback(function(record) {
            self._record.unsubscribe('onPropertyChange', self._onPropertyChangeHandler);
            self._record = null;
            self._wasDestroyed = true;
            self._isNewRecord = false;
            self._forceUpdate();
            return record;
         });
         return resultDef;
      }
   });

   return module;
});
