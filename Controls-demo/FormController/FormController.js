define('Controls-demo/FormController/FormController', [
   'Core/Control',
   'wml!Controls-demo/FormController/FormController',
   'WS.Data/Source/Memory',
   'Core/Deferred',
   'WS.Data/Entity/Record',
   'WS.Data/Entity/Model',
   'Core/IoC',
   'css!Controls-demo/FormController/FormController',
   'Controls/Validate/Validators/IsRequired',
   'Controls/Validate/Validators/IsEmail'
], function(Control, tmpl, MemorySource, Deferred, Record, Model, IoC) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      _dataSource: null,
      idCount: 1,
      _key: 0,
      _record: null,
      _recordAsText: '',
      _beforeMount: function(cfg) {
         this._dataSource = cfg.dataSource || new MemorySource({
            idProperty: 'id',
            data: [{ id: 0 }]
         });
      },

      _create: function(config) {
         var self = this;
         var resultDef = new Deferred();
         var initValues = config.initValues;
         var finishDef = this._children.registrator.finishPendingOperations(this.__$resultForTests);

         initValues.id = this.idCount;

         finishDef.addCallback(function(finishResult) {
            var createDef = self._children.formControllerInst.create(initValues);
            createDef.addCallback(function(result) {
               self.idCount++;
               resultDef.callback(true);
               return result;
            }).addErrback(function(e) {
               resultDef.errback(e);
               IoC.resolve('ILogger').error('FormController example', '', e);
               return e;
            });
            return finishResult;
         });
         finishDef.addErrback(function(e) {
            resultDef.errback(e);
            IoC.resolve('ILogger').error('FormController example', '', e);
            return e;
         });

         return resultDef;
      },
      _read: function(config) {
         var self = this;
         var resultDef = new Deferred();

         var finishDef = this._children.registrator.finishPendingOperations(this.__$resultForTests);

         finishDef.addCallback(function(finishResult) {
            self._key = config.key;
            self._record = null;
            self._forceUpdate();
            resultDef.callback(true);
            return finishResult;
         });
         finishDef.addErrback(function(e) {
            resultDef.errback(e);
            IoC.resolve('ILogger').error('FormController example', '', e);
            return e;
         });

         return resultDef;
      },
      _update: function() {
         return this._children.formControllerInst.update();
      },
      _delete: function() {
         return this._children.formControllerInst.delete();
      },

      _clickCreateHandler: function() {
         this._create({
            initValues: {
               nameText: 'no name',
               emailText: 'no@email.com'
            }
         });
      },
      _clickReadHandler: function(e, id) {
         this._read({ key: id });
      },
      _clickUpdateHandler: function() {
         this._update();
      },
      _clickDeleteHandler: function() {
         this._delete();
      },

      _alertHandler: function(e, msg) {
         this._alert(msg);
      },
      _alert: function(msg) {
         console.log(msg);
      },
      getRecordString: function() {
         if (!this._record) {
            return '';
         }
         if (!this._record.getRawData()) {
            return '';
         }
         return JSON.stringify(this._record.getRawData());
      },
      _createSuccessedHandler: function(e, record) {
         this._alert('FormController demo: create successed');
         this._updateValuesByRecord(record);
      },
      _updateSuccessedHandler: function(e, record, key) {
         this._alert('FormController demo: update successed with key ' + key);
         this._updateValuesByRecord(record);
      },
      _updateFailedHandler: function() {
         this._alert('FormController demo: update failed');
         this._updateValuesByRecord(this._record);
      },
      _validationFailedHandler: function() {
         this._alert('FormController demo: validation failed');
         this._updateValuesByRecord(this._record);
      },
      _readSuccessedHandler: function(e, record) {
         this._alert('FormController demo: read successed');
         this._updateValuesByRecord(record);
      },
      _readFailedHandler: function(e, err) {
         this._alert('FormController demo: read successed');
         this._updateValuesByRecord(new Model());
      },
      _deleteSuccessedHandler: function(e) {
         this._alert('FormController demo: delete successed');
         this._updateValuesByRecord(new Model());
      },
      _deleteFailedHandler: function(e) {
         this._alert('FormController demo: delete failed');
         this._updateValuesByRecord(new Model());
      },
      _updateValuesByRecord: function(record) {
         this._record = record;

         this._key = this._record.get('id');
         this._recordAsText = this.getRecordString();

         // запросим еще данные прямо из dataSource и обновим dataSourceRecordString
         var self = this;
         var def = this._dataSource.read(this._key);
         def.addCallback(function(record) {
            if (!record) {
               return '';
            }
            if (!record.getRawData()) {
               return '';
            }
            self.dataSourceRecordString = JSON.stringify(record.getRawData());
            self._forceUpdate();
         });
         def.addErrback(function(e) {
            self.dataSourceRecordString = '??';
            self._forceUpdate();
            return e;
         });
         this._forceUpdate();
      },
      _requestCustomUpdate: function() {
         return false;
      }
   });

   return module;
});
