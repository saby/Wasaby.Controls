/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.RecordSet', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Adapter.Json',
   'js!SBIS3.CONTROLS.Data.Model'
], function (ObservableList, JsonAdapter) {
   'use strict';

   /**
    * Список записей
    * @class SBIS3.CONTROLS.Data.Collection.RecordSet
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableList
    * @author Мальцев Алексей
    * @state mutable
    * @public
    */

   var RecordSet = ObservableList.extend(/** @lends SBIS3.CONTROLS.Data.Collection.RecordSet.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.RecordSet',
      $protected: {
         _options: {
            /**
             * @cfg {Object} Данные в "сыром" виде
             * @example
             * <pre>
             *    var users = new RecordSet({
             *       rawData: [{
             *          id: 1,
             *          firstName: 'John',
             *          lastName: 'Smith'
             *       },{
             *          id: 2,
             *          firstName: 'Sara',
             *          lastName: 'Conor'
             *       }],
             *       adapter: new JsonAdapter,
             *       idProperty: 'id'
             *    });
             *    users.at(0).get('id');//5
             *    users.getRecordById(2).get('firstName');//Sara
             * </pre>
             * @see getRawData
             * @see setRawData
             */
            rawData: null,

            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными
             * @example
             * <pre>
             *    var user = new RecordSet({
             *       adapter: new SbisAdapter()
             *    });
             * </pre>
             * @see getAdapter
             * @see setAdapter
             */
            adapter: undefined,

            /**
             * @cfg {Object} Метаданные
             */
            meta: {},

            /**
             * @cfg {String} Поле, содержащее первичный ключ
             */
            idProperty: '',

            /**
             * @cfg {Function} Конструктор модели
             */
            model: undefined
         },
         /**
          * @var {Function} Конструктор модели
          */
         _model: undefined,
         /**
          * @var {Object} Сырые данные
          */
         _rawData: null,
         /**
          * @var {Object} индексы
          */
         _indexTree: {},
         /**
          * @var {SBIS3.CONTROLS.Data.Adapter.ITable} Адаптер для набора записей
          */
         _tableAdapter: undefined
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         this._model = 'model' in cfg ? cfg.model : $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.ModelConstructor');
         if ('data' in cfg && !('rawData' in cfg)) {
            this._options.rawData = cfg.data;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Collection.RecordSet', 'option "data" is deprecated and will be removed in 3.7.4. Use "rawData" instead.');
         }
         if ('strategy' in cfg && !('adapter' in cfg)) {
            this._options.adapter = cfg.strategy;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Collection.RecordSet', 'option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.');
         }
         if ('keyField' in cfg && !('idProperty' in cfg)) {
            this._options.idProperty = cfg.keyField;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Collection.RecordSet', 'option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.');
         }
         this._initAdapter();
         if ('items' in cfg && !('rawData' in cfg)) {
            this._initForItems();
         } else {
            this.setRawData(this._options.rawData);
         }
      },

      saveChanges: function(dataSource, added, changed, deleted) {
         //TODO: refactor after migration to SBIS3.CONTROLS.Data.Source.ISource
         added = added === undefined ? true : added;
         changed = changed === undefined ? true : changed;
         deleted = deleted === undefined ? true : deleted;
         var self = this;
         var syncCompleteDef = new $ws.proto.ParallelDeferred(),
            willRemove = [];
         this.each(function(model) {
            if (model.isDeleted()) {
               syncCompleteDef.push(dataSource.destroy(model.getId()).addCallback(function() {
                  model.setStored(false);
                  willRemove.push(model);//each рушится если удалять тут, поэтому удаляем потом
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
         return syncCompleteDef.getResult().addCallback(function (){
            $ws.helpers.map(willRemove, this.remove, this);
         });
      },

      //region SBIS3.CONTROLS.DataSet

      removeRecord: function (key) {
         var self = this;
         var mark = function (key) {
            var record = self.getRecordById(key);
            if (record) {
               record.setDeleted(true);
            }
         };

         if (key instanceof Array) {
            var length = key.length;
            for (var i = 0; i < length; i++) {
               mark(key[i]);
            }
         } else {
            mark(key);
         }
      },
      /**
       * Возвращает запись по ключу
       * @param id
       * @public
       * @returns {*}
       */
      getRecordById: function (id) {
         return this.at(
            this.getIndexById(id)
         );
      },
      /**
       * @deprecated метод будет удален в 3.7.4 используйте getRecordById
       * @param key
       * @returns {*}
       */
      getRecordByKey: function (key) {
         return this.getRecordById(key);
      },
      /**
       * Возвращает индекс элемента по ключу
       * @param id
       * @public
       * @returns {*}
       */
      getIndexById: function (id) {
         return this.getItemIndexByPropertyValue(this._options.idProperty, id);
      },
      /**
       * Возвращает копию рекордсета
       * @public
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       */
      clone: function () {
         return new RecordSet({
            strategy: this._options.strategy,
            data: this._rawData,
            meta: this._options.meta,
            keyField: this._options.keyField
         });
      },

      getRecordKeyByIndex: function (index) {
         var item = this.at(index);
         return item && $ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model') ? item.getId() : undefined;
      },

      getStrategy: function () {
         $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Collection.RecordSet:getStrategy', 'method getStrategy is deprecated and will be removed in 3.7.4. Use "getAdapter" instead.');
         return this.getAdapter();
      },

      getAdapter: function (){
         return this._options.adapter;
      },

      merge: function (dataSetMergeFrom, options) {
         /*TODO какая то лажа с ключами*/
         if ((!this._keyField) && (dataSetMergeFrom._keyField)) {
            this._keyField = dataSetMergeFrom._keyField;
         }
         this._setRecords(dataSetMergeFrom._getRecords(), options);
      },

      push: function (record) {
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Model')) {
            record = new this._model({
               compatibleMode: true,
               adapter: this.getAdapter(),
               rawData: record,
               idProperty: this._options.idProperty
            });
            record.setStored(true);
         }
         this.add(record);
      },

      insert: function (record, at) {
         var existsAt = this.getIndex(record);
         if (existsAt == -1) {
            this.add(record, at);
         } else {
            this.replace(record, existsAt);
         }
      },

      setRawData: function(data) {
         this._items = [];
         this._rawData = data;
         var adapter = this._getTableAdapter(true),
            count = adapter.getCount(),
            record;
         for (var i = 0; i < count; i++) {
            record = new this._model({
               compatibleMode: true,
               adapter: this.getAdapter(),
               rawData: adapter.at(i),
               idProperty: this._options.idProperty
            });
            record.setStored(true);
            RecordSet.superclass.add.call(this, record);
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
               adapter: this.getAdapter(),
               rawData: this._options.meta.path,
               idProperty: this._options.idProperty
            });
         }

         if (this._options.meta &&
            this._options.meta.results &&
            !$ws.helpers.instanceOfModule(this._options.meta.results, 'SBIS3.CONTROLS.Data.Model')
         ) {
            this._options.meta.results = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Model', {
               adapter: this.getAdapter(),
               rawData: this._options.meta.results,
               idProperty: this._options.idProperty
            });
         }

         return this._options.meta;
      },

      setMetaData: function (meta) {
         this._options.meta = meta;
      },

      // TODO: В контролах избавиться от вызова этого метода - должно быть достаточно "выбрать по индексу".
      getTreeIndex: function(field, reindex){
         if (reindex || (Object.isEmpty(this._indexTree) && field)){
            this._reindexTree(field);
         }
         return this._indexTree;
      },

      getChildItems: function (parentId, getFullBranch, field) {
         if(Object.isEmpty(this._indexTree)) {
            this._reindexTree(field);
         }
         parentId = (typeof parentId != 'undefined') ? parentId : null;
         if (this._indexTree.hasOwnProperty(parentId)) {
            if (getFullBranch) {
               var curParent = parentId,
                  parents = [],
                  childs = [];

               do {
                  $ws.helpers.forEach(this._indexTree[curParent], function (newParent) {
                     parents.push(newParent);
                     childs.push(newParent);
                  });
                  if (parents.length) {
                     curParent = Array.remove(parents, 0);
                  } else {
                     curParent = null;
                  }
               } while (curParent);
               return childs;
            }
            return this._indexTree[parentId];
         } else {
            return [];
         }
      },

      hasChild: function (parentKey, field) {
         if(Object.isEmpty(this._indexTree)) {
            this._reindexTree(field);
         }
         return this._indexTree.hasOwnProperty(parentKey);
      },

      getParent: function () {
      },

      getParentKey: function (record, field) {
         return record.get(field);
      },

      filter: function (filterCallback) {
         var filterDataSet = new RecordSet({
            adapter: this._options.adapter,
            idProperty: this._idProperty
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

            if ((record = self.getRecordById(key))) {
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
               if(parentKey === null || this.getIndexById(parentKey) !== -1 ){
                  this._indexTree[parentKey] = [record.getKey()];
               }
            } else {
               this._indexTree[parentKey].push(record.getKey());
            }
         }, 'all');
      },

      //endregion SBIS3.CONTROLS.DataSet

      /*region list*/


      _splice: function (items, start){
         var newItems = [];
         if(items instanceof Array) {
            newItems = items;
         } else if(items && $ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            var self = this;
            items.each(function (item){
               newItems.push(item);
            });
         } else {
            throw new Error('Invalid argument');
         }
         for (var i=0, len = newItems.length; i< len; i++) {
            var item = newItems[i];
            this._checkItem(item);
            this._getTableAdapter().add(item.getRawData(), start);
            this._items.splice(item, start, 0);
            start++;
         }

         this._getServiceEnumerator().reIndex();
      },

      clear: function () {
         this.setRawData(this._getTableAdapter().getEmpty());
         RecordSet.superclass.clear.call(this);
      },

      add: function (item, at) {
         this._checkItem(item);
         this._getTableAdapter().add(item.getRawData(), at);
         RecordSet.superclass.add.apply(this, arguments);
      },

      removeAt: function (index) {
         RecordSet.superclass.removeAt.apply(this, arguments);
         this._getTableAdapter().remove(index);
      },

      replace: function (item, at) {
         RecordSet.superclass.replace.apply(this, arguments);
         if (!this._isValidIndex(at)) {
            throw new Error('Index is out of bounds');
         }

         this._items[at] = item;
         this._getTableAdapter().replace(item.getRawData(), at);
         this._getServiceEnumerator().reIndex();
      },
      /*endregion list*/

      //region Protected methods
      _getTableAdapter: function (forceCreate) {
         return (this._tableAdapter && !forceCreate) ?  this._tableAdapter : (this._tableAdapter = this.getAdapter().forTable(this._rawData));
      },

      _checkItem: function (item) {
         if(!item || !$ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model')){
            throw new Error('Item is not a model')
         }
         return true;
      },

      /**
       * Инициализирует адаптер
       * @private
       */
      _initAdapter: function () {
         if (!this._options.adapter) {
            this._options.adapter = new JsonAdapter();
         }
      }
      //endregion Protected methods

   });
   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Collection.RecordSet', function(config) {
      return new RecordSet(config);
   });
   return RecordSet;
});
