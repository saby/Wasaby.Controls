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
    * Список записей
    * @class SBIS3.CONTROLS.Data.Collection.RecordSet
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableList
    * @mixes SBIS3.CONTROLS.Data.FormattableMixin
    * @ignoreOptions items
    * @author Мальцев Алексей
    * @public
    */

   var RecordSet = ObservableList.extend([FormattableMixin], /** @lends SBIS3.CONTROLS.Data.Collection.RecordSet.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.RecordSet',
      $protected: {
         _options: {
            /**
             * @typedef {Object} OperationOptions
             * @property {Boolean} [add=true] Добавлять новые записи
             * @property {Boolean} [remove=false] Удалять отсутствующие записи
             * @property {Boolean} [merge=true] Объединять одинаковые записи
             */

            /**
             * @typedef {String} RecordStatus
             * @variant actual Актуальные записи
             * @variant all Все записи
             * @variant created Новые записи
             * @variant deleted Удаленные записи
             * @variant changed Измененные записи
             */

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
          * @var {Object} индексы
          */
         _indexTree: {}
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         if ('data' in cfg && !('rawData' in cfg)) {
            this._options.rawData = cfg.data;
            Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "data" is deprecated and will be removed in 3.7.4. Use "rawData" instead.', 1);
         }
         if ('strategy' in cfg && !('adapter' in cfg)) {
            this._options.adapter = cfg.strategy;
            Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.', 1);
         }
         if ('keyField' in cfg && !('idProperty' in cfg)) {
            this._options.idProperty = cfg.keyField;
            Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.', 1);
         }
         if (!this._options.idProperty) {
            this._options.idProperty = this.getAdapter().getKeyField(this._options.rawData);
         }
         if ('items' in cfg) {
            Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "items" is not acceptable. Use "rawData" instead.', 1);
         }
         if (this._options.rawData) {
            this._assignRawData(this._options.rawData, true);
            this._createFromRawData();
         }
      },

      //region SBIS3.CONTROLS.Data.SerializableMixin

      _setSerializableState: function(state) {
         return RecordSet.superclass._setSerializableState(state).callNext(function() {
            this.each(function(record) {
               record.setOwner(this);
            }, this);
         });
      },

      //endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region SBIS3.CONTROLS.Data.FormattableMixin

      setRawData: function(data) {
         this._assignRawData(data);
         this._createFromRawData();
      },

      addField: function(format, at, value) {
         format = this._buildField(format);
         RecordSet.superclass.addField.call(this, format, at);

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
         RecordSet.superclass.removeField.call(this, name);

         var methodName = 'removeField';
         this.each(function(record) {
            record.notifyFormatChanged(methodName, arguments);
         });
      },

      removeFieldAt: function(at) {
         RecordSet.superclass.removeFieldAt.call(this, at);

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
         return this.getAdapter().forTable(this._options.rawData);
      },

      /**
       * Переустанавливает сырые данные
       * @param {Object} data Данные в "сыром" виде
       * @param {Boolean} [keepFormat=false] Сохранить формат
       * @protected
       */
      _assignRawData: function(data, keepFormat) {
         RecordSet.superclass.setRawData.call(this, data);
         if (!keepFormat) {
            this._clearFormat();
         }
      },

      //endregion SBIS3.CONTROLS.Data.FormattableMixin

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Перебирает все записи рекордсета.
       * @param {Function} iterateCallback Ф-я обратного вызова, аргументами будут  переданы запись и ее позиция
       * @param {RecordStatus} [status=actual] Селектор состояния выбираемых записей
       */
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

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region Public methods

      /**
       * Синхронизирует изменения в рекордсете с источником данных следующим образом:
       * - записи, отмеченные удаленными через removeRecord() - удаляются в источнике данных;
       * - обновленные записи - обновляются в источнике данных;
       * - добавленные записи - добавляются в источник данных.
       * @param {SBIS3.CONTROLS.Data.Source.ISource} dataSource Источник данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения
       * @deprecated метод будет удален в 3.7.4.
       */
      saveChanges: function(dataSource, added, changed, deleted) {
         //TODO: refactor after migration to SBIS3.CONTROLS.Data.Source.ISource
         added = added === undefined ? true : added;
         changed = changed === undefined ? true : changed;
         deleted = deleted === undefined ? true : deleted;

         var syncCompleteDef = new $ws.proto.ParallelDeferred(),
            self = this,
            position = 0,
            willRemove = [];
         this.each(function(model) {
            if (model.isDeleted() && !model.isSynced()) {
               model.setSynced(true);
               syncCompleteDef.push(dataSource.destroy(model.getId()).addCallback(function() {
                  willRemove.push(model);
                  return model;
               }));
            } else if (model.isChanged() || (!model.isStored() && !model.isSynced())) {
               syncCompleteDef.push(dataSource.update(model).addCallback(function() {
                  model.applyChanges();
                  model.setStored(true);
                  return model;
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
       * @see SBIS3.CONTROLS.Data.Model#idProperty
       */
      getIdProperty: function () {
         return this._options.idProperty;
      },

      /**
       * Устанавливает свойство модели, содержащее первичный ключ
       * @param {String} name
       * @see getIdProperty
       * @see idProperty
       * @see SBIS3.CONTROLS.Data.Model#idProperty
       */
      setIdProperty: function (name) {
         this._options.idProperty = name;
         this.each((function(item) {
            item.setIdProperty(this._options.idProperty);
         }).bind(this));
      },

      /**
       * Возвращает запись по ключу
       * @param {String|Number} id
       * @returns {SBIS3.CONTROLS.Data.Model}
       */
      getRecordById: function (id) {
         return this.at(
            this.getIndexByValue(this._options.idProperty, id)
         );
      },

      /**
       * Возвращает запись по ключу
       * @param {String|Number} key
       * @returns {SBIS3.CONTROLS.Data.Model}
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
       * Возвращает метаданные.
       * @remark
       * Существуют два служебных поля в метаданных:
       * - path - путь для хлебных крошек, возвращается как {@link SBIS3.CONTROLS.Data.Collection.RecordSet};
       * - results - строка итогов, возвращается как {@link SBIS3.CONTROLS.Data.Model}.
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
       * @remark
       * Существуют два служебных поля в метаданных:
       * - path - путь для хлебных крошек, устанавливается как {@link SBIS3.CONTROLS.Data.Collection.RecordSet};
       * - results - строка итогов, устанавливается как {@link SBIS3.CONTROLS.Data.Model}.
       * @param {Object} meta Метаданные
       * @see meta
       * @see getMetaData
       */
      setMetaData: function (meta) {
         this._options.meta = meta;
      },

      //endregion Public methods

      //region Deprecated methods

      /**
       * Помечает запись, как удаленную (сама запись при этом не удаляется, но она не попадает в перебор в методе each().
       * @param {String} key Первичный ключ записи
       * @deprecated метод будет удален в 3.7.4.
       */
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
         return this.getIndexByValue(this._options.idProperty, id);
      },

      /**
       * Возвращает ключ записи по ее порядковому номеру
       * @param {Number} index
       * @returns {String|Number}
       * @deprecated метод будет удален в 3.7.4 используйте getRecordById().getId()
       */
      getRecordKeyByIndex: function (index) {
         var item = this.at(index);
         return item && $ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model') ? item.getId() : undefined;
      },

      /**
       * Возвращает стратегию работы с сырыми данными
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @deprecated метод будет удален в 3.7.4 используйте getAdapter()
       */
      getStrategy: function () {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet:getStrategy(): method is deprecated and will be removed in 3.7.4. Use "getAdapter()" instead.');
         return this.getAdapter();
      },

      /**
       * Объединяет два рекордсета
       * @param {SBIS3.CONTROLS.Data.Collection.RecordSet} recordSetMergeFrom
       * @param {OperationOptions} options Опции операций
       * @deprecated метод будет удален в 3.7.4
       */
      merge: function (recordSetMergeFrom, options) {
         this._setRecords(recordSetMergeFrom._getRecords(), options);
      },

      /**
       * Добавляет запись в рекордсет
       * @param {SBIS3.CONTROLS.Data.Model} record
       * @deprecated метод будет удален в 3.7.4, используйте add()
       */
      push: function (record) {
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Model')) {
            record = this._getModelInstance(record);
         }
         this.add(record);
      },

      /**
       * Вставляет запись в рекордсет. Если запись с таким ключем существует, то старая заменяется.
       * @param {SBIS3.CONTROLS.Data.Model} record
       * @param {Number} at Позиция вставки
       * @deprecated метод будет удален в 3.7.4, используйте add() или replace()
       */
      insert: function (record, at) {
         var existsAt = this.getIndex(record);
         if (existsAt === -1) {
            this.add(record, at);
         } else {
            this.replace(record, existsAt);
         }
      },

      /**
       * Возвращает иерархический индекс для указанного поля
       * @param {String} field Имя поля, по которому строится иерархия
       * @param {Boolean} [reindex=false] Принудительно переиндексировать
       * @returns {Object.<String|Number, Array.<String|Number>>}
       * @deprecated метод будет удален в 3.7.4 используйте SBIS3.CONTROLS.Data.Projection.Tree::getChildren()
       */
      getTreeIndex: function(field, reindex){
         if (reindex || (Object.isEmpty(this._indexTree) && field)){
            this._reindexTree(field);
         }
         return this._indexTree;
      },

      /**
       * Возвращает набор дочерних элементов для указанного родителя
       * @param {String|Number} parentId Идентификатор родителя
       * @param {Boolean} getFullBranch Выбирать рекурсивно
       * @param {String} field Имя поля, по которому строится иерархия
       * @returns {Array.<String|Number>}
       * @deprecated метод будет удален в 3.7.4 используйте SBIS3.CONTROLS.Data.Projection.Tree::getChildren()
       */
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

      /**
       * Возвращает признак наличия детей у родителя
       * @param {String|Number} parentId Идентификатор родителя
       * @param {String} field Имя поля, по которому строится иерархия
       * @returns {Boolean}
       * @deprecated метод будет удален в 3.7.4 используйте SBIS3.CONTROLS.Data.Projection.Tree::getChildren()
       */
      hasChild: function (parentKey, field) {
         if(Object.isEmpty(this._indexTree)) {
            this._reindexTree(field);
         }
         return this._indexTree.hasOwnProperty(parentKey);
      },

      /**
       * Возвращает идентификатор родителя
       * @param {SBIS3.CONTROLS.Data.Model} record Запись, для которой нужно получить идентфикатор родителя
       * @param {String} field Имя поля, по которому строится иерархия
       * @returns {String|Number}
       * @deprecated метод будет удален в 3.7.4 используйте SBIS3.CONTROLS.Data.Projection.TreeItem::getParent()
       */
      getParentKey: function (record, field) {
         return record.get(field);
      },

      /**
       * Возвращает отфильтрованный рекордсет
       * @param {Function} filterCallback Функция обратного вызова, аргументом будет передана запись, для которой нужно вернуть признак true (запись прошла фильтр) или false (не прошла)
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       * @deprecated метод будет удален в 3.7.4
       */
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

      /**
       * Возвращает массив записей
       * @returns {Array.<SBIS3.CONTROLS.Data.Model>}
       * @protected
       * @deprecated метод будет удален в 3.7.4 используйте each()
       */
      _getRecords: function() {
         return this.toArray();
      },

      /**
       * Устанавливает новые записи
       * @param {Array.<SBIS3.CONTROLS.Data.Model>} records Новые записи
       * @param {OperationOptions} options Опции операций
       * @protected
       * @deprecated метод будет удален в 3.7.4
       */
      _setRecords: function (records, options) {
         options = $ws.core.merge(options || {}, {add: true, remove: true, merge: true}, {preferSource: true});

         var id, i, length,
            recordsMap = {},
            toAdd = [],
            toReplace = {};
         var l = 0, l1 = 0;
         for (i = 0, length = records.length; i < length; i++) {
            id = records[i].getId();
            recordsMap[id] = true;
            var index = this.getIndexByValue(this._options.idProperty, id);
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
            var newItems = [];
            this.each(function (record) {
               var key = record.getId();
               if (recordsMap[key]) {
                  newItems.push(record);
               }
            }, 'all');
            if(newItems.length < this.getCount()) {
               this.assign(newItems);
            }
         }
      },

      /**
       * Переиндесирует иерархию
       * @param {String} field Имя поля, по которому строится иерархия
       * @protected
       * @deprecated метод будет удален в 3.7.4
       */
      _reindexTree: function (field) {
         this._reindex();
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
            this._indexTree[parentKey].push(record.getId());
         }, 'all');
      },

      //endregion Deprecated methods

      //region SBIS3.CONTROLS.Data.Collection.List

      clear: function () {
         for (var i = 0, count = this._items.length; i < count; i++) {
            this._items[i].setOwner(null);
         }
         this._getRawDataAdapter().clear();
         RecordSet.superclass.clear.call(this);
         this._indexTree = {};
      },

      add: function (item, at) {
         this._checkItem(item, this.getCount() > 0);
         this._getRawDataAdapter().add(item.getRawData(), at);
         RecordSet.superclass.add.apply(this, arguments);
         item.setOwner(this);
         this._indexTree = {};
      },

      remove: function (item) {
         this._checkItem(item, false);
         item.setOwner(null);
         this._indexTree = {};
         return RecordSet.superclass.remove.apply(this, arguments);
      },

      removeAt: function (index) {
         this._getRawDataAdapter().remove(index);
         var item = this._items[index];
         if (item) {
            item.setOwner(null);
         }
         RecordSet.superclass.removeAt.apply(this, arguments);
         this._indexTree = {};
      },

      replace: function (item, at) {
         this._checkItem(item);
         item.setOwner(this);
         this._getRawDataAdapter().replace(item.getRawData(), at);
         RecordSet.superclass.replace.apply(this, arguments);
         this._indexTree = {};
      },

      assign: function (items) {
         this._getRawDataAdapter().clear();
         items = this._addItemsToRawData(items, undefined, true);
         RecordSet.superclass.assign.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
         this._indexTree = {};
      },

      append: function (items) {
         items = this._addItemsToRawData(items);
         RecordSet.superclass.append.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
         this._indexTree = {};
      },

      prepend: function (items) {
         items = this._addItemsToRawData(items, 0);
         RecordSet.superclass.prepend.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
         this._indexTree = {};
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
       * @param {*} model Данные модели
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @protected
       */
      _getModelInstance: function (data) {
         var model = Di.resolve(this._options.model, {
            owner: this,
            adapter: this.getAdapter(),
            rawData: data,
            idProperty: this._options.idProperty
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
      },

      _reindex: function() {
         this._resetIndexTree();
         RecordSet.superclass._reindex.call(this);
      },

      /**
       * сбрасывает индекс
       */
      _resetIndexTree: function(){
         this._indexTree = {};
      }
      //endregion Protected methods
   });


   Di.register('collection.recordset', RecordSet);

   return RecordSet;
});
