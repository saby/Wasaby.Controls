/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.RecordSet', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.FormattableMixin',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Model'
], function (ObservableList, FormattableMixin, Di, Utils) {
   'use strict';

   /**
    * Список записей, имеющих общий формат полей.
    * @class SBIS3.CONTROLS.Data.Collection.RecordSet
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableList
    * @mixes SBIS3.CONTROLS.Data.FormattableMixin
    * @ignoreOptions items
    * @author Мальцев Алексей
    * @public
    */

   var RecordSet = ObservableList.extend([FormattableMixin], /** @lends SBIS3.CONTROLS.Data.Collection.RecordSet.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.RecordSet',

      /**
       * @cfg {String|Function} Конструктор модели
       * @name SBIS3.CONTROLS.Data.Collection.RecordSet#model
       * @see getModel
       * @see SBIS3.CONTROLS.Data.Record
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
      _$model: 'model',

      /**
       * @cfg {String} Поле модели, содержащее первичный ключ
       * @name SBIS3.CONTROLS.Data.Collection.RecordSet#idProperty
       * @see getIdProperty
       * @example
       * <pre>
       *    var dataSource = new RecordSet({
       *       idProperty: 'primaryId'
       *    });
       * </pre>
       */
      _$idProperty: '',

      /**
       * @cfg {Object} Метаданные
       * @name SBIS3.CONTROLS.Data.Collection.RecordSet#meta
       * @see getMetaData
       * @see setMetaData
       */
      _$meta: null,

      /**
       * @member {Object} индексы
       */
      _indexTree: null,

      constructor: function $RecordSet(options) {
         if (options) {
            if ('data' in options && !('rawData' in options)) {
               this._$rawData = options.data;
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "data" is deprecated and will be removed in 3.7.4. Use "rawData" instead.', 1);
            }
            if ('strategy' in options && !('adapter' in options)) {
               this._$adapter = options.strategy;
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.', 1);
            }
            if ('keyField' in options && !('idProperty' in options)) {
               this._$idProperty = options.keyField;
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.', 1);
            }
            if (!this._$idProperty) {
               this._$idProperty = this.getAdapter().getKeyField(this._$rawData);
            }
            if ('items' in options) {
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "items" is not acceptable. Use "rawData" instead.', 1);
            }
         }

         this._indexTree = {};
         RecordSet.superclass.constructor.call(this, options);
         FormattableMixin.constructor.call(this, options);
         this._$meta = this._$meta || {};
         if (this._$rawData) {
            this._assignRawData(this._$rawData, true);
            this._createFromRawData();
         }
      },

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function(state) {
         state = RecordSet.superclass._getSerializableState.call(this, state);
         state = FormattableMixin._getSerializableState.call(this, state);
         delete state.$options.items;
         return state;
      },

      _setSerializableState: function(state) {
         return RecordSet.superclass._setSerializableState(state)
            .callNext(
               FormattableMixin._setSerializableState(state)
            )
            .callNext(function() {
               this._clearServiceEnumerator();
            });
      },

      //region SBIS3.CONTROLS.Data.FormattableMixin

      setRawData: function(data) {
         this._assignRawData(data);
         this._createFromRawData();
      },

      addField: function(format, at, value) {
         format = this._buildField(format);
         FormattableMixin.addField.call(this, format, at);

         var name = format.getName(),
            methodName = 'addField';
         this.each(function(record) {
            record.notifyFormatChanged(methodName, arguments);
            if (value !== undefined) {
               record.set(name, value);
            }
         });
      },

      removeField: function(name) {
         FormattableMixin.removeField.call(this, name);

         var methodName = 'removeField';
         this.each(function(record) {
            record.notifyFormatChanged(methodName, arguments);
         });
      },

      removeFieldAt: function(at) {
         FormattableMixin.removeFieldAt.call(this, at);

         var methodName = 'removeFieldAt';
         this.each(function(record) {
            record.notifyFormatChanged(methodName, arguments);
         });
      },

      /**
       * Создает адаптер для сырых данных
       * @returns {SBIS3.CONTROLS.Data.Adapter.ITable}
       * @protected
       */
      _createRawDataAdapter: function () {
         return this.getAdapter().forTable(this._$rawData);
      },

      /**
       * Переустанавливает сырые данные
       * @param {Object} data Данные в "сыром" виде
       * @param {Boolean} [keepFormat=false] Сохранить формат
       * @protected
       */
      _assignRawData: function(data, keepFormat) {
         FormattableMixin.setRawData.call(this, data);
         if (!keepFormat) {
            this._clearFormat();
         }
      },

      //endregion SBIS3.CONTROLS.Data.FormattableMixin

      //region Public methods

      saveChanges: function(dataSource, added, changed, deleted) {
         //TODO: refactor after migration to SBIS3.CONTROLS.Data.Source.ISource
         added = added === undefined ? true : added;
         changed = changed === undefined ? true : changed;
         deleted = deleted === undefined ? true : deleted;

         var syncCompleteDef = new $ws.proto.ParallelDeferred(),
            self = this,
            position = 0,
            willRemove = [];
         this.each(function(record) {
            if (record.isDeleted() && !record.isSynced()) {
               record.setSynced(true);
               syncCompleteDef.push(dataSource.destroy(record.get(self._$idProperty)).addCallback(function() {
                  willRemove.push(record);
                  return record;
               }));
            } else if (record.isChanged() || (!record.isStored() && !record.isSynced())) {
               syncCompleteDef.push(dataSource.update(record).addCallback(function() {
                  record.applyChanges();
                  record.setStored(true);
                  return record;
               }));
            }
            position++;
         }, 'all');

         syncCompleteDef.done(true);
         return syncCompleteDef.getResult(true).addCallback(function(){
            $ws.helpers.map(willRemove, self.remove, self);
            self._getServiceEnumerator().reIndex();
         });
      },

      /**
       * Возвращает свойство модели, содержащее первичный ключ
       * @returns {String}
       * @see setIdProperty
       * @see idProperty
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Устанавливает свойство модели, содержащее первичный ключ
       * @param {String} name
       * @see getIdProperty
       * @see idProperty
       */
      setIdProperty: function (name) {
         this._$idProperty = name;
      },

      /**
       * Возвращает запись по ключу
       * @param id
       * @returns {*}
       */
      getRecordById: function (id) {
         return this.at(
            this.getIndexByValue(this._$idProperty, id)
         );
      },
      /**
       * Возвращает запись по ключу
       * @param key
       * @returns {*}
       * @deprecated метод будет удален в 3.7.4 используйте getRecordById
       */
      getRecordByKey: function (key) {
         return this.getRecordById(key);
      },

      /**
       * Проверяет эквивалентность формата и записей другого рекордсета (должны совпадать данные каждой записи).
       * @param {SBIS3.CONTROLS.Data.Collection.RecordSet} recordset Рекордсет, эквивалентность которого проверяется
       * @returns {Boolean}
       */
      isEqual: function (recordset) {
         if (recordset === this) {
            return true;
         }
         if (!recordset) {
            return false;
         }
         if (!$ws.helpers.instanceOfModule(recordset, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            return false;
         }
         //TODO: когда появятся форматы, сделать через сравнение форматов и записей
         return $ws.helpers.isEqualObject(
            this.getRawData(),
            recordset.getRawData()
         );
      },

      /**
       * Возвращает метаданные
       * @returns {Object}
       * @see meta
       * @see setMetaData
       */
      getMetaData: function () {
         if (this._$meta &&
            this._$meta.path &&
            !$ws.helpers.instanceOfModule(this._$meta.path, 'SBIS3.CONTROLS.Data.Collection.RecordSet')
         ) {
            this._$meta.path = new RecordSet({
               adapter: this.getAdapter(),
               rawData: this._$meta.path,
               idProperty: this._$idProperty
            });
         }

         if (this._$meta &&
            this._$meta.results &&
            !$ws.helpers.instanceOfModule(this._$meta.results, 'SBIS3.CONTROLS.Data.Model')
         ) {
            this._$meta.results = Di.resolve('model', {
               adapter: this.getAdapter(),
               rawData: this._$meta.results,
               idProperty: this._$idProperty
            });
         }

         return this._$meta;
      },

      /**
       * Устанавливает метаданные
       * @param meta {Object} Метаданные
       * @see meta
       * @see getMetaData
       */
      setMetaData: function (meta) {
         this._$meta = meta;
      },

      //endregion Public methods

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
       * Возвращает индекс элемента по ключу
       * @param id
       * @returns {*}
       * @deprecated метод будет удален в 3.7.4 используйте getIndex(getRecordById())
       */
      getIndexById: function (id) {
         return this.getIndexByValue(this._$idProperty, id);
      },

      getRecordKeyByIndex: function (index) {
         var item = this.at(index);
         return item && $ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Record') ? item.get(this._$idProperty) : undefined;
      },

      getStrategy: function () {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet:getStrategy(): method is deprecated and will be removed in 3.7.4. Use "getAdapter()" instead.');
         return this.getAdapter();
      },

      merge: function (recordSetMergeFrom, options) {
         this._setRecords(recordSetMergeFrom._getRecords(), options);
      },

      push: function (record) {
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Record')) {
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
         parentId = parentId === undefined ? null : parentId;
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

      getParentKey: function (record, field) {
         return record.get(field);
      },

      filter: function (filterCallback) {
         var filterDataSet = new RecordSet({
            adapter: this._$adapter,
            idProperty: this._$idProperty
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

         var id, i, length,
            recordsMap = {},
            toAdd = [],
            toReplace = {};
         var l = 0, l1 = 0;
         for (i = 0, length = records.length; i < length; i++) {
            id = records[i].get(this._$idProperty);
            recordsMap[id] = true;
            var index = this.getIndexByValue(this._$idProperty, id);
            if (index > -1) {
               toReplace[index] = records[i];
               l++;
            } else {
               toAdd.push(records[i]);
               l1++;
            }
         }
         if(options.merge) {
            for(i in toReplace){
               if (toReplace.hasOwnProperty(i)) {
                  this.replace(toReplace[i], +i);
               }
            }
         }
         if (options.add) {
            this.append(toAdd);
         }
         if (options.remove) {
            var self = this,
               newItems = [];
            this.each(function (record) {
               var key = record.get(self._$idProperty);
               if (recordsMap[key]) {
                  newItems.push(record);
               }
            }, 'all');
            if(newItems.length < this.getCount()) {
               this.assign(newItems);
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
            this._indexTree[parentKey].push(record.get(self._$idProperty));
         }, 'all');
      },

      //endregion SBIS3.CONTROLS.DataSet

      //region SBIS3.CONTROLS.Data.Collection.List

      clear: function () {
         this._assignRawData(this._getRawDataAdapter().getEmpty(), true);
         for (var i = 0, count = this._$items.length; i < count; i++) {
            this._$items[i].setOwner(null);
         }
         RecordSet.superclass.clear.call(this);
      },

      add: function (item, at) {
         this._checkItem(item, this.getCount() > 0);
         this._getRawDataAdapter().add(item.getRawData(), at);
         RecordSet.superclass.add.call(this, item, at);
         item.setOwner(this);
      },

      remove: function (item) {
         this._checkItem(item, false);
         item.setOwner(null);
         return RecordSet.superclass.remove.call(this, item);
      },

      removeAt: function (index) {
         this._getRawDataAdapter().remove(index);
         var item = this._$items[index];
         if (item) {
            item.setOwner(null);
         }
         RecordSet.superclass.removeAt.call(this, index);
      },

      replace: function (item, at) {
         this._checkItem(item);
         item.setOwner(this);
         this._getRawDataAdapter().replace(item.getRawData(), at);
         RecordSet.superclass.replace.call(this, item, at);
      },

      assign: function (items) {
         var adapter;
         if (items && $ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            adapter = items.getAdapter().forTable(items.getRawData());
         } else {
            adapter = this._getRawDataAdapter();
         }
         this._assignRawData(adapter.getEmpty());

         items = this._addItemsToRawData(items, undefined, true);
         RecordSet.superclass.assign.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
      },

      append: function (items) {
         items = this._addItemsToRawData(items);
         RecordSet.superclass.append.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
      },

      prepend: function (items) {
         items = this._addItemsToRawData(items, 0);
         RecordSet.superclass.prepend.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
      },

      //endregion SBIS3.CONTROLS.Data.Collection.List

      //region Protected methods

      /**
       * Вставляет сырые данные записей в сырые данные рекордсета
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable|Array} items Коллекция записей
       * @param {Number} [at] Позиция вставки
       * @param {Boolean} [replace=false] Режим полной замены
       * @returns {Array}
       * @protected
       */
      _addItemsToRawData: function (items, at, replace) {
         var isEqualFormat = this._isEqualItemsFormat(items, replace),
            hasItems = replace ? false : this.getCount() > 0,
            adapter = this._getRawDataAdapter(),
            item;

         items = this._itemsToArray(items);
         for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (!isEqualFormat) {
               this._checkItem(
                  item,
                  hasItems || i > 0
               );

            }
            adapter.add(
               item.getRawData(),
               at === undefined ? undefined : at + i
            );
         }

         return items;
      },

      /**
       * Возвращает признак, что коллекция является рекордсетом с эквивалентным форматом
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable|Array} [items] Коллекция
       * @param {Boolean} [replace=false] Режим полной замены
       * @returns {Boolean}
       * @protected
       */
      _isEqualItemsFormat: function (items, replace) {
         if (items && $ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            if (replace) {
               return true;
            }
            if (this._getFormat().isEqual(items.getFormat())) {
               return true;
            }
            Utils.logger.info(this._moduleName +': the outer recordset format is not equal to the recordset format');
         }
         return false;
      },

      /**
       * Проверяет, что переданный элемент - это запись с идентичным форматом
       * @param {*} item Запись
       * @param {Boolean} [checkFormat=true] Проверять формат
       * @protected
       */
      _checkItem: function (item, checkFormat) {
         if (!item || !$ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Record')) {
            throw new Error('Item should be an instance of SBIS3.CONTROLS.Data.Record');
         }
         if ((checkFormat === undefined || checkFormat === true) &&
            !this._getFormat().isEqual(item.getFormat())
         ) {
            Utils.logger.info(this._moduleName + ': the record format is not equal to the recordset format');
         }
      },

      /**
       * Создает новый экземпляр модели
       * @param {*} data Данные модели
       * @returns {SBIS3.CONTROLS.Data.Record}
       * @protected
       */
      _getModelInstance: function (data) {
         var model = Di.resolve(this._$model, {
            owner: this,
            adapter: this.getAdapter(),
            rawData: data,
            idProperty: this._$idProperty
         });
         model.setStored(true);
         return model;
      },

      /**
       * Пересоздает элементы из сырых данных
       * @param {Object} data Сырые данные
       * @protected
       */
      _createFromRawData: function() {
         RecordSet.superclass.clear.call(this);
         var adapter = this._getRawDataAdapter(),
            count = adapter.getCount(),
            record;
         for (var i = 0; i < count; i++) {
            record = this._getModelInstance(adapter.at(i));
            RecordSet.superclass.add.call(this, record);
         }
         this._reindex();
      }

      //endregion Protected methods

   });

   Di.register('collection.recordset', RecordSet);

   return RecordSet;
});
