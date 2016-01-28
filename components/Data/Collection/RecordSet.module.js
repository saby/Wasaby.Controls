/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.RecordSet', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Adapter.Json',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Model'
], function (ObservableList, JsonAdapter, Di) {
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
             * @cfg {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию {@link SBIS3.CONTROLS.Data.Adapter.Json}
             * @see getAdapter
             * @see setAdapter
             * @see SBIS3.CONTROLS.Data.Adapter.Json
             * @see SBIS3.CONTROLS.Data.Di
             * @example
             * <pre>
             *    var user = new RecordSet({
             *       adapter: 'adapter.sbis'
             *    });
             * </pre>
             * @example
             * <pre>
             *    var user = new RecordSet({
             *       adapter: new SbisAdapter()
             *    });
             * </pre>
             */
            adapter: 'adapter.json',

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
             *          firstName: 'Sarah',
             *          lastName: 'Connor'
             *       }],
             *       idProperty: 'id'
             *    });
             *    users.at(0).get('id');//1
             *    users.getRecordById(2).get('firstName');//Sarah
             * </pre>
             * @see getRawData
             * @see setRawData
             */
            rawData: null,

            /**
             * @cfg {String|Function} Конструктор модели
             * @see getModel
             * @see SBIS3.CONTROLS.Data.Model
             * @see SBIS3.CONTROLS.Data.Di
             * @example
             * <pre>
             *    var User = Model.extend({
             *       identify: function(login, password) {
             *       }
             *    });
             *    Di.register('model.user', User);
             *    //...
             *    var user = new RecordSet({
             *       model: 'model.user'
             *    });
             * </pre>
             * @example
             * <pre>
             *    var User = Model.extend({
             *       identify: function(login, password) {
             *       }
             *    });
             *    //...
             *    var user = new RecordSet({
             *       model: User
             *    });
             * </pre>
             */
            model: 'model',

            /**
             * @cfg {String} Поле модели, содержащее первичный ключ
             * @see getIdProperty
             * @see SBIS3.CONTROLS.Data.Model#idProperty
             * @example
             * <pre>
             *    var dataSource = new RecordSet({
             *       idProperty: 'primaryId'
             *    });
             * </pre>
             */
            idProperty: '',

            /**
             * @cfg {Object} Метаданные
             * @see getMetaData
             * @see setMetaData
             */
            meta: {}
         },

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
         _tableAdapter: null
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

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
                  model.applyChanges();
                  model.setStored(true);
                  return model;
               }));
            }
         }, 'all');
         syncCompleteDef.done(true);
         return syncCompleteDef.getResult().addCallback(function (){
            $ws.helpers.map(willRemove, self.remove, self);
         });
      },

      /**
       * Возвращает адаптер для работы с данными
       * @returns {String|SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @see adapter
       * @see SBIS3.CONTROLS.Data.Adapter.IAdapter
       */
      getAdapter: function (){
         if (typeof this._options.adapter === 'string') {
            this._options.adapter = Di.resolve(this._options.adapter);
         }
         return this._options.adapter;
      },

      /**
       * Возвращает сырые данные
       * @returns {Object}
       * @see setRawData
       * @see rawData
       */
      getRawData: function() {
         return this._rawData;
      },

      /**
       * Устанавливает сырые данные
       * @param rawData {Object} Сырые данные
       * @see getRawData
       * @see rawData
       */
      setRawData: function(data) {
         RecordSet.superclass.clear.call(this);
         this._rawData = data;
         this._resetTableAdapter();
         var adapter = this._getTableAdapter(),
            count = adapter.getCount(),
            record;
         for (var i = 0; i < count; i++) {
            record = this._getModelInstance(adapter.at(i));
            RecordSet.superclass.add.call(this, record);
         }
      },

      /**
       * Возвращает свойство модели, содержащее первичный ключ
       * @returns {String}
       * @see idProperty
       * @see SBIS3.CONTROLS.Data.Model#idProperty
       */
      getIdProperty: function () {
         return this._options.idProperty;
      },

      /**
       * Возвращает метаданные
       * @returns {Object}
       * @see meta
       * @see setMetaData
       */
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
            this._options.meta.results = Di.resolve('model', {
               adapter: this.getAdapter(),
               rawData: this._options.meta.results,
               idProperty: this._options.idProperty
            });
         }

         return this._options.meta;
      },

      /**
       * Устанавливает метаданные
       * @param meta {Object} Метаданные
       * @see meta
       * @see getMetaData
       */
      setMetaData: function (meta) {
         this._options.meta = meta;
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
            this.getIndexByValue(this._options.idProperty, id)
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
       * @deprecated метод будет удален в 3.7.4 используйте getIndex(getRecordById())
       * @public
       * @returns {*}
       */
      getIndexById: function (id) {
         return this.getIndexByValue(this._options.idProperty, id);
      },
      /**
       * Возвращает копию рекордсета
       * @public
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       */
      clone: function () {
         //TODO: сделать через сериализатор
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

      merge: function (dataSetMergeFrom, options) {
         /*TODO какая то лажа с ключами*/
         if ((!this._keyField) && (dataSetMergeFrom._keyField)) {
            this._keyField = dataSetMergeFrom._keyField;
         }
         this._setRecords(dataSetMergeFrom._getRecords(), options);
      },

      push: function (record) {
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Model')) {
            record = this._getModelInstance(record);
         }
         this.add(record);
      },

      insert: function (record, at) {
         var existsAt = this.getIndex(record);
         if (existsAt === -1) {
            this.add(record, at);
         } else {
            this.replace(record, existsAt);
         }
      },

      each: function (iterateCallback, status) {
         var length = this.getCount();
         for (var i = 0; i < length; i++) {
            var record = this.at(i);
            switch (status) {
               case 'all':
                  iterateCallback.call(this, record, i);
                  break;
               case 'created':
                  if (record.isCreated()) {
                     iterateCallback.call(this, record, i);
                  }
                  break;
               case 'deleted':
                  if (record.isDeleted()) {
                     iterateCallback.call(this, record, i);
                  }
                  break;
               case 'changed':
                  if (record.isChanged()) {
                     iterateCallback.call(this, record, i);
                  }
                  break;
               default :
                  if (!record.isDeleted()) {
                     iterateCallback.call(this, record, i);
                  }
            }
         }
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
         this._reindex();

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
      },

      //endregion SBIS3.CONTROLS.DataSet

      //region SBIS3.CONTROLS.Data.Collection.List

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
         this._checkItem(item);
         RecordSet.superclass.replace.apply(this, arguments);

         this._getTableAdapter().replace(item.getRawData(), at);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.List

      //region Protected methods

      /**
       * Вставляет набор записей в указанную позицию
       * @private
       */
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
         for (var i = 0, len = newItems.length; i< len; i++) {
            var item = newItems[i];
            this._checkItem(item);
            this._getTableAdapter().add(item.getRawData(), start);
            this._items.splice(item, start, 0);
            start++;
         }

         this._getServiceEnumerator().reIndex();
      },

      /**
       * Возвращает адаптер для сырых данных (лениво создает)
       * @private
       */
      _getTableAdapter: function () {
         return this._tableAdapter || (this._tableAdapter = this.getAdapter().forTable(this._rawData));
      },

      /**
       * Сбрасывает созданный адаптер для сырых данных
       * @private
       */
      _resetTableAdapter: function () {
         this._tableAdapter = null;
      },

      /**
       * Создает новый экземпляр модели
       * @param {*} model Данные модели
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @private
       */
      _getModelInstance: function (data) {
         var model = Di.resolve(this._options.model, {
            compatibleMode: true,
            adapter: this.getAdapter(),
            rawData: data,
            idProperty: this._options.idProperty
         });
         model.setStored(true);
         return model;
      },

      /**
       * ПРроверяет, что переданный элемент - модель
       * @private
       */
      _checkItem: function (item) {
         if(!item || !$ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model')){
            throw new Error('Item should be an instance of SBIS3.CONTROLS.Data.Model');
         }
         return true;
      }

      //endregion Protected methods

   });

   Di.register('collection.recordset', RecordSet);

   return RecordSet;
});
