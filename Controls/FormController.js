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

         if (cfg.record && cfg.record instanceof Model) {
            this._record && this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
            this._record = cfg.record;
            this._record.subscribe('onPropertyChange', this._onPropertyChangeHandler);
            if (cfg.isNewRecord) {
               this._isNewRecord = cfg.isNewRecord;
            }
         } else if (cfg.idValue !== undefined && cfg.idValue !== null) {
            var readDef = cfg.dataSource.read(cfg.idValue, cfg.readMetaData);
            readDef.addCallback(function(record) {
               self._record && self._record.unsubscribe('onPropertyChange', self._onPropertyChangeHandler);
               self._record = record;
               self._record.subscribe('onPropertyChange', self._onPropertyChangeHandler);
               self._readInMounting = { isError: false, result: record };
               return record;
            });
            readDef.addErrback(function(e) {
               IoC.resolve('ILogger').error('FormController', 'Не смог прочитать запись ' + cfg.idValue, e);
               self._record && self._record.unsubscribe('onPropertyChange', self._onPropertyChangeHandler);
               self._readInMounting = { isError: true, result: e };
               throw e;
            });
            return readDef;
         } else {
            self._record && this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
            var createDef = cfg.dataSource.create();
            createDef.addCallback(function(record) {
               self._record = record;
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
         if (this._createdInMounting) {
            if (!this._createdInMounting.isError) {
               this._notify('createSuccessed', [this._createdInMounting.result], { bubbling: true });
               this._createHandler(this._record);
            } else {
               this._notify('createFailed', [this._createdInMounting.result], { bubbling: true });
            }
            this._createdInMounting = null;
         }
         if (this._readInMounting) {
            if (!this._readInMounting.isError) {
               this._notify('readSuccessed', [this._readInMounting.result], { bubbling: true });
               this._readHandler(this._record);
            } else {
               this._notify('readFailed', [this._readInMounting.result], { bubbling: true });
            }
            this._readInMounting = null;
         }
      },
      _afterUpdate: function() {
         if (this._wasCreated || this._wasRead || this._wasDestroyed) {
            this._children.validation.setValidationResult(null);
            this._wasCreated = false;
            this._wasRead = false;
            this._wasDestroyed = false;
         }

         if (this._options.record && this._options.record instanceof Model) {
            this._record && this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
            this._record = this._options.record;
            this._record.subscribe('onPropertyChange', this._onPropertyChangeHandler);
            if (this._options.isNewRecord) {
               this._isNewRecord = this._options.isNewRecord;
            }
         } else if (this._options.idValue !== undefined && this._options.idValue !== null) {
            this.read(this._options.idValue);
         } else {
            this.create();
         }
      },
      _beforeUnmount: function() {
         this._record.unsubscribe('onPropertyChange', this._onPropertyChangeHandler);
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
                  def.callback(res);
                  return res;
               }, function(e) {
                  this._updateByPopup = false;
                  def.callback(false);
                  return e;
               });
            } else if (answer === false) {
               def.callback(false);
            }
         }

         if (this.hasOwnProperty('__$resultForTests')) {
            updating.call(this, this.__$resultForTests);
         } else {
            var self = this;

            return self._children.popupOpener.open({
               message: rk('Сохранить изменения?'),
               details: rk('Чтобы продолжить редактирование, нажмите "Отмена".'),
               type: 'yesnocancel'
            }).addCallback(function(answer) {
               updating.call(self, answer);
            });
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
         this._wasRead = true;
         this._isNewRecord = false;
         this._forceUpdate();
         return record;
      },

      update: function() {
         var self = this,
            record = this._record,
            updateDef = new Deferred();

         var validationDef = this._children.validation.submit();
         validationDef.addCallback(function(results) {
            var isError = Object.keys(results).find(function(key) {
               return Array.isArray(results[key]);
            });
            if (!isError) {
               self._notify('validationSuccessed', [], { bubbling: true });
               var isChanged = self._record.isChanged();
               var res = self._children.crud.update(record, self._isNewRecord);
               if (res instanceof Deferred) {
                  res.addCallback(function(record) {
                     if (self._isNewRecord && !self._updateByPopup) {
                        self._createPendingDef.callback(true);
                     }
                     if (isChanged && !self._updateByPopup) {
                        self._propertyChangedDef.callback(true);
                        self._propertyChangeNotified = false;
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
                     self._createPendingDef.callback(true);
                  }
                  if (isChanged && !self._updateByPopup) {
                     self._propertyChangedDef.callback(true);
                     self._propertyChangeNotified = false;
                  }
                  self._isNewRecord = false;
                  updateDef.callback(true);
               }
            } else {
               self._notify('validationFailed', [], { bubbling: true });
               updateDef.callback(false);
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
