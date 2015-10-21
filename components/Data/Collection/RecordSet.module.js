/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.RecordSet', [
   'js!SBIS3.CONTROLS.Data.Collection.List'
], function (List) {
   'use strict';

   /**
    * Список, работающий с записями
    * @class SBIS3.CONTROLS.Data.Collection.RecordSet
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @author Мальцев Алексей
    * @remark
    * Этот модуль временный. Обеспечивает совместимость c  SBIS3.CONTROLS.DataSet по API.
    */

   var RecordSet = List.extend(/** @lends SBIS3.CONTROLS.Data.Collection.RecordSet.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.RecordSet',
      $protected: {
         _options: {
            strategy: null,
            data: undefined,
            meta: {},
            keyField: ''
         },
         _rawData: undefined
      },

      $constructor: function (cfg) {
         if (!('compatibleMode' in cfg)) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.RecordSet', 'module SBIS3.CONTROLS.Data.Collection.RecordSet is deprecated, use SBIS3.CONTROLS.Data.Collection.LoadableList instead. It will be removed in 3.8.0.');
         }
         if ('data' in cfg) {
            this.setRawData(cfg.data);
         }
      },

      //region SBIS3.CONTROLS.DataSet

      removeRecord: function (key) {
         if (!(key instanceof Array)) {
            key = [key];
         }
         for (var i = 0; i < key.length; i++) {
            var record = this.getRecordByKey(key);
            if (record) {
               record.setDeleted(true);
            }
         }
      },

      getRecordByKey: function (key) {
         return this.at(
            this.getItemIndexByPropertyValue('id', key)
         );
      },

      getRecordKeyByIndex: function (index) {
         var item = this.at(index);
         return item && $ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model') ? item.getId() : undefined;
      },

      getStrategy: function () {
         return this._options.strategy;
      },

      merge: function (dataSetMergeFrom, options) {
         var self = this,
            record;
         dataSetMergeFrom.each(function(outerRecord) {
            if ((record = self.getRecordByKey(record.getKey()))) {
               record.merge(outerRecord);
            } else {
               this.add(outerRecord);
            }
         });
      },

      push: function (record) {
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Record')) {
            record = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Model', {
               adapter: this.getStrategy(),
               raw: record,
               keyField: this._options.keyField
            });
         }
         this.add(record);
      },

      insert: function (record, at) {
         this.add(record, at);
      },

      setRawData: function(data) {
         this.fill();

         this._rawData = data;

         var adapter = this.getStrategy().forTable(),
            count = adapter.getCount(data);
         for (var i = 0; i < count; i++) {
            this.add($ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Model', {
               adapter: this.getStrategy(),
               data: adapter.at(data, i),
               idProperty: this._options.keyField
            }));
         }
      },

      getRawData: function() {
         return this._rawData;
      },

      each: function (iterateCallback, status) {
         var length = this.getCount();
         for (var i = 0; i < length; i++) {
            var record = this.at(i);
            switch (status) {
               case 'all':
                  iterateCallback.call(this, record);
                  break;
               case 'created':
                  if (record.isCreated()) {
                     iterateCallback.call(this, record);
                  }
                  break;
               case 'deleted':
                  if (record.isDeleted()) {
                     iterateCallback.call(this, record);
                  }
                  break;
               case 'changed':
                  if (record.isChanged()) {
                     iterateCallback.call(this, record);
                  }
                  break;
               default :
                  if (!record.isDeleted()) {
                     iterateCallback.call(this, record);
                  }
            }
         }
      },

      getMetaData: function () {
         return this._options.meta;
      },

      setMetaData: function (meta) {
         this._options.meta = meta;
      },

      getChildItems: function (parentId, getFullBranch, field) {
         var items = this.getItemsByPropertyValue(field, parentId);
         if (getFullBranch) {
            items.map((function(item) {
               Array.prototype.push.apply(items, this.getChildItems(
                  item.getId(), getFullBranch, field
               ));
            }).bind(this));
         }
         return items;
      },

      hasChild: function (parentKey, field) {
         return this.getItemByPropertyValue(field, parentKey) !== undefined;
      },

      getParent: function () {
      },

      getParentKey: function (record, field) {
         return record.get(field);
      },

      filter: function (filterCallback) {
         var filterDataSet = new RecordSet({
            strategy: this._options.strategy,
            keyField: this._keyField
         });

         this.each(function (record) {
            if (filterCallback(record)) {
               filterDataSet.push(record);
            }
         });

         return filterDataSet;
      },

      _reindexTree: function () {
         this._getServiceEnumerator().reIndex();
      }

      //endregion SBIS3.CONTROLS.DataSet

      //region Protected methods

      //endregion Protected methods

   });

   return RecordSet;
});
