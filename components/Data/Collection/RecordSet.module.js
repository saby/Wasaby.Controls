/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.RecordSet', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Model'
], function (ObservableList, DataSet) {
   'use strict';

   /**
    * Список записей
    * @class SBIS3.CONTROLS.Data.Collection.RecordSet
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableList
    * @author Мальцев Алексей
    * @state mutable
    * @remark
    * Этот модуль временный. Обеспечивает совместимость c  SBIS3.CONTROLS.DataSet по API.
    */

   var RecordSet = ObservableList.extend(/** @lends SBIS3.CONTROLS.Data.Collection.RecordSet.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.RecordSet',
      $protected: {
         _options: {
            strategy: null,
            data: undefined,
            meta: {},
            keyField: ''
         },
         _model: undefined,
         _rawData: undefined,
         _indexTree: {}
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         if (!('compatibleMode' in cfg)) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.RecordSet', 'module SBIS3.CONTROLS.Data.Collection.RecordSet is deprecated and will be removed in 3.8.0. Use SBIS3.CONTROLS.Data.Collection.LoadableList instead.');
         }
         this._model = 'model' in cfg ? cfg.model : $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.ModelConstructor');
         if ('data' in cfg) {
            this.setRawData(cfg.data);
         }
      },

      saveChanges: function(dataSource, added, changed, deleted) {
         //TODO: refactor after migration to SBIS3.CONTROLS.Data.Source.ISource
         added = added === undefined ? true : added;
         changed = changed === undefined ? true : changed;
         deleted = deleted === undefined ? true : deleted;

         var syncCompleteDef = new $ws.proto.ParallelDeferred();
         this.each(function(model) {
            if (model.isDeleted()) {
               syncCompleteDef.push(dataSource.destroy(model.getId()).addCallback(function() {
                  model.setStored(false);
                  return model;
               }));
            } else if (model.isChanged() || !model.isStored()) {
               syncCompleteDef.push(dataSource.update(model).addCallback(function() {
                  model.setChanged(false);
                  model.setStored(true);
                  return model;
               }));
            }
         }, 'all');

         syncCompleteDef.done(true);
         return syncCompleteDef.getResult();
      },

      //region SBIS3.CONTROLS.DataSet

      removeRecord: function (key) {
         return DataSet.prototype.removeRecord.call(this, key);
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
         return DataSet.prototype.merge.call(this, dataSetMergeFrom, options);
      },

      push: function (record) {
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Model')) {
            record = new this._model({
               compatibleMode: true,
               adapter: this.getStrategy(),
               data: record,
               idProperty: this._options.keyField
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
            this.add(new this._model({
               compatibleMode: true,
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
         if (this._options.meta &&
            this._options.meta.path &&
            !$ws.helpers.instanceOfModule(this._options.meta.path, 'SBIS3.CONTROLS.Data.Collection.RecordSet')
         ) {
            this._options.meta.path = new RecordSet({
               compatibleMode: true,
               strategy: this.getStrategy(),
               data: this._options.meta.path,
               keyField: this._options.keyField
            });
         }

         if (this._options.meta &&
            this._options.meta.results &&
            !$ws.helpers.instanceOfModule(this._options.meta.results, 'SBIS3.CONTROLS.Data.Model')
         ) {
            this._options.meta.results = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Model', {
               compatibleMode: true,
               adapter: this.getStrategy(),
               data: this._options.meta.results,
               idProperty: this._options.keyField
            });
         }

         return this._options.meta;
      },
      getTreeIndex: function(field, reindex){
         if (reindex || (Object.isEmpty(this._indexTree) && field)){
            this._reindexTree(field);
         }
         return this._indexTree;
      },



      setMetaData: function (meta) {
         this._options.meta = meta;
      },

      getChildItems: function (parentId, getFullBranch, field) {
         return DataSet.prototype.getChildItems.call(this, parentId, getFullBranch, field);
      },

      hasChild: function (parentKey, field) {
         return DataSet.prototype.hasChild.call(this, parentKey, field);
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

      _getRecords: function() {
         return this.toArray();
      },

      _setRecords: function (records, options) {
         options = options || {};
         options = $ws.core.merge(options, {add: true, remove: true, merge: true}, {preferSource: true});

         var self = this,
            recordsMap = {},
            record,
            key;
         for (var i = 0, length = records.length; i < length; i++) {
            key = records[i].getKey();
            recordsMap[key] = true;

            if ((record = self.getRecordByKey(key))) {
               if (options.merge) {
                  record.merge(records[i]);
               }
            } else if (options.add) {
               this.add(records[i]);
            }
         }

         if (options.remove) {
            var toRemove = [];
            this.each(function (record) {
               var key = record.getKey();
               if (!recordsMap[key]) {
                  toRemove.push(key);
               }
            }, 'all');

            if (toRemove.length) {
               this.removeRecord(toRemove);
            }
         }
      },

      _reindexTree: function (field) {
         this._getServiceEnumerator().reIndex();

         this._indexTree = {};
         var self = this,
            parentKey;
         this.each(function (record) {
            parentKey = null;
            if (field) {
               parentKey = self.getParentKey(record, field);
               if (parentKey === undefined) {
                  parentKey = null;
               }
            }
            if (!this._indexTree.hasOwnProperty(parentKey)) {
               this._indexTree[parentKey] = [];
            }
            this._indexTree[parentKey].push(record.getKey());
         }, 'all');
      }

      //endregion SBIS3.CONTROLS.DataSet

      //region Protected methods

      //endregion Protected methods

   });

   return RecordSet;
});
