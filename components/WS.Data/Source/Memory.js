/* global define */
define('js!WS.Data/Source/Memory', [
   'js!WS.Data/Source/Local',
   'js!WS.Data/Source/DataSet',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-instance',
   'Core/Deferred',
   'Core/helpers/generate-helpers'
], function (
   Local,
   DataSet,
   Di,
   Utils,
   CoreInstance,
   CoreDeferred,
   GenerateHelpers
) {
   'use strict';

   /**
    * Источник данных в памяти ОС.
    * Позволяет получать данные из объектов в оперативной памяти.
    *
    * Создадим источник со списком объектов солнечной системы:
    * <pre>
    *    var solarSystem = new MemorySource({
    *       data: [
    *          {id: 1, name: 'Sun', kind: 'Star'},
    *          {id: 2, name: 'Mercury', kind: 'Planet'},
    *          {id: 3, name: 'Venus', kind: 'Planet'},
    *          {id: 4, name: 'Earth', kind: 'Planet'},
    *          {id: 5, name: 'Mars', kind: 'Planet'},
    *          {id: 6, name: 'Jupiter', kind: 'Planet'},
    *          {id: 7, name: 'Saturn', kind: 'Planet'},
    *          {id: 8, name: 'Uranus', kind: 'Planet'},
    *          {id: 9, name: 'Neptune', kind: 'Planet'},
    *          {id: 10, name: 'Pluto', kind: 'Dwarf planet'}
    *       ],
    *       idProperty: 'id'
    *    });
    * </pre>
    * Создадим новый объект:
    * <pre>
    *    solarSystem.create(
    *       {id: 11, name: 'Moon', 'kind': 'Satellite'}
    *    ).addCallback(function(satellite) {
    *       satellite.get('name');//'Moon'
    *    });
    * </pre>
    * Прочитаем данные о Солнце:
    * <pre>
    *    solarSystem.read(1).addCallback(function(star) {
    *       star.get('name');//'Sun'
    *    });
    * </pre>
    * Вернем Плутону статус планеты:
    * <pre>
    *    var pluto = new Model({
    *          idProperty: 'id'
    *       });
    *    pluto.set({
    *       id: 10,
    *       name: 'Pluto',
    *       kind: 'Planet'
    *    });
    *
    *    solarSystem.update(pluto).addCallback(function() {
    *       alert('Pluto is a planet again!');
    *    });
    * </pre>
    * Удалим Марс:
    * <pre>
    *    solarSystem.destroy(5).addCallback(function() {
    *       alert('Mars deleted!');
    *    });
    * </pre>
    * Получим список планет:
    * <pre>
    *    var query = new Query();
    *    query.where({
    *       kind: 'Planet'
    *    });
    *    dataSource.query(query).addCallback(function(dataSet) {
    *       var planets = dataSet.getAll();
    *       planets.getCount();//8
    *       planets.each(function(planet)) {
    *          console.log(planet.get('name'));
    *       });
    *       //output: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
    *    });
    * </pre>
    * @class WS.Data/Source/Memory
    * @extends WS.Data/Source/Local
    * @ignoreOptions binding endpoint
    * @public
    * @author Мальцев Алексей
    */

   var Memory = Local.extend(/** @lends WS.Data/Source/Memory.prototype */{
      _moduleName: 'WS.Data/Source/Memory',

      /**
       * @cfg {Object} Данные, с которыми работает источник.
       * @name WS.Data/Source/Memory#data
       * @remark
       * Данные должны быть в формате, поддерживаемом адаптером {@link adapter}.
       * @example
       * Создадим источник с данными объектов солнечной системы, данные представлены в виде массива:
       * <pre>
       *    var solarSystem = new MemorySource({
       *       data: [
       *          {id: 1, name: 'Sun', kind: 'Star'},
       *          {id: 2, name: 'Mercury', kind: 'Planet'},
       *          {id: 3, name: 'Venus', kind: 'Planet'},
       *          {id: 4, name: 'Earth', kind: 'Planet'},
       *          {id: 5, name: 'Mars', kind: 'Planet'},
       *          {id: 6, name: 'Jupiter', kind: 'Planet'},
       *          {id: 7, name: 'Saturn', kind: 'Planet'},
       *          {id: 8, name: 'Uranus', kind: 'Planet'},
       *          {id: 9, name: 'Neptune', kind: 'Planet'},
       *          {id: 10, name: 'Pluto', kind: 'Dwarf planet'}
       *       ],
       *       idProperty: 'id'
       *    });
       * </pre>
       * Создадим источник с данными объектов солнечной системы, данные представлены в виде {@link WS.Data/Collection/RecordSet рекордсета}:
       * <pre>
       *    define(['js!WS.Data/Adapter/RecordSet'], function () {
       *       var solarData = new RecordSet({
       *          rawData: [
       *             {id: 1, name: 'Sun', kind: 'Star'},
       *             {id: 2, name: 'Mercury', kind: 'Planet'},
       *             {id: 3, name: 'Venus', kind: 'Planet'},
       *             {id: 4, name: 'Earth', kind: 'Planet'},
       *             {id: 5, name: 'Mars', kind: 'Planet'},
       *             {id: 6, name: 'Jupiter', kind: 'Planet'},
       *             {id: 7, name: 'Saturn', kind: 'Planet'},
       *             {id: 8, name: 'Uranus', kind: 'Planet'},
       *             {id: 9, name: 'Neptune', kind: 'Planet'},
       *             {id: 10, name: 'Pluto', kind: 'Dwarf planet'}
       *          ]
       *       });
       *       var solarSystem = new MemorySource({
       *          data: solarData,
       *          adapter: 'adapter.recordset',
       *          idProperty: 'id'
       *       });
       *    });
       * </pre>
       */
      _$data: null,

      _dataSetItemsProperty: 'items',

      _dataSetTotalProperty: 'total',

      /**
       * @member {WS.Data/Adapter/ITable} Адаптер для таблицы
       */
      _tableAdapter: null,

      /**
       * @member {Object.<String, *>} Пустые данные по таблицам
       */
      _emptyData: null,

      /**
       * @member {Object.<String, Number>} Индекс для быстрого поиска записи по ключу
       */
      _index: null,

      constructor: function $Memory(options) {
         Memory.superclass.constructor.call(this, options);

         if (this._$endpoint.contract && !_static.contracts.hasOwnProperty(this._$endpoint.contract)) {
            _static.contracts[this._$endpoint.contract] = this._$data;
         }
         this._reIndex();
      },

      //region WS.Data/Source/ISource

      create: function (meta) {
         return CoreDeferred.success(
            this._prepareCreateResult(meta)
         );
      },

      read: function (key) {
         var data = this._getRecordByKey(key);
         if (data) {
            return CoreDeferred.success(
               this._prepareReadResult(data)
            );
         } else {
            return CoreDeferred.fail(
               'Record with key "' + key + '" does not exist'
            );
         }
      },

      update: function (data) {
         var updateRecord = function(record) {
               var idProperty = this.getIdProperty(),
                  key = idProperty ? record.get(idProperty) : null;
               if (!key) {
                  key = GenerateHelpers.randomId('k');
                  record.set(idProperty, key);
               }

               var adapter = this._getTableAdapter(),
                  index = this._getIndexByKey(key);

               if (index === -1) {
                  adapter.add(
                     record.getRawData()
                  );
                  if (this._index) {
                     this._index[key] = adapter.getCount() - 1;
                  }
               } else {
                  adapter.replace(
                     record.getRawData(),
                     index
                  );
               }
               return key;
            }.bind(this),
            keys = [];

         if(CoreInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet')){
            data.each(function(record){
               keys.push(updateRecord(record));
            });
         } else {
            keys = updateRecord(data);
         }
         return CoreDeferred.success(
            this._prepareUpdateResult(data, keys)
         );
      },

      destroy: function (keys) {
         if (!(keys instanceof Array)) {
            keys = [keys];
         }
         for (var i = 0, len = keys.length; i < len; i++) {
            if (!this._destroy(keys[i])) {
               return CoreDeferred.fail('Record with key "' + keys[i] + '" isn\'t found');
            }
         }
         return CoreDeferred.success(true);
      },

      copy: function(key) {
         var index = this._getIndexByKey(key);
         if (index === -1) {
            return CoreDeferred.fail('Record with key "' + key + '" isn\'t found');
         } else {
            var copy = this._getTableAdapter().copy(index);
            this._reIndex();
            return CoreDeferred.success(this._prepareReadResult(copy));
         }
      },

      merge: function(from, to) {
         var indexOne = this._getIndexByKey(from),
            indexTwo = this._getIndexByKey(to);
         if (indexOne === -1 || indexTwo === -1) {
            return CoreDeferred.fail('Record with key "' + from + '" or "' + to + '" isn\'t exists');
         } else {
            this._getTableAdapter().merge(
               indexOne,
               indexTwo,
               this.getIdProperty()
            );
            this._reIndex();
            return CoreDeferred.success(true);
         }
      },

      query: function (query) {
         var items = this._applyFrom(query ? query.getFrom() : undefined),
            adapter = this.getAdapter(),
            total;
         if (query) {
            items = this._applyJoin(items, query.getJoin());
            items = this._applyWhere(items, query.getWhere());
            items = this._applyOrderBy(items, query.getOrderBy());
            total = adapter.forTable(items).getCount();
            items = this._applyPaging(items, query.getOffset(), query.getLimit());

            //selection has no items - return an empty table
            if (items === undefined) {
               items = this._getEmptyData(query);
            }
         } else {
            total = adapter.forTable(items).getCount();
         }

         return CoreDeferred.success(
            this._prepareQueryResult({
               items: items,
               total: total
            })
         );
      },

      call: function (command, data) {
         throw new Error('Not supported');
      },

      //endregion WS.Data/Source/ISource

      //region Protected methods

      move: function (items, target, meta) {
         meta = meta || {};
         var sourceItems = [],
            targetPosition = -1,
            targetItem = null;
         if (!(items instanceof Array)) {
            items = [items];
         }
         var tableAdapter = this._getTableAdapter(),
            adapter = this.getAdapter();

         items.forEach(function(id) {
            var index = this._getIndexByKey(id);
            sourceItems.push(adapter.forRecord(tableAdapter.at(index)));
         }, this);

         if (target !== null) {
            targetPosition = this._getIndexByKey(target);
            targetItem = adapter.forRecord(tableAdapter.at(targetPosition));
            if (targetPosition === -1) {
               return CoreDeferred.fail('Can\'t find target position');
            }
         }
         if (meta.position == 'on') {
            return this._hierarchyMove(sourceItems, targetItem, meta);
         }
         return this._reorderMove(sourceItems, targetItem, meta);
      },

      _reorderMove: function(items, target, meta) {
         var parentValue,
            tableAdapter = this._getTableAdapter(),
            targetsId = target.get(this._$idProperty) ;
         if (meta.parentProperty) {
            parentValue = target.get(meta.parentProperty);
         }
         if (!meta.position && meta.hasOwnProperty('before')) {
            meta.position = meta.before ? this.MOVE_POSITION.before : this.MOVE_POSITION.after;
         }
         items.forEach(function(item) {
            if (meta.parentProperty) {
               item.set(meta.parentProperty, parentValue);
            }
            var index = this._getIndexByKey(item.get(this._$idProperty)),
               targetIndex = this._getIndexByKey(targetsId);
            if (meta.position == this.MOVE_POSITION.before) {
               targetIndex--;
            }
            tableAdapter.move(index, targetIndex);
            this._reIndex();
         }.bind(this));
         return new CoreDeferred().callback();
      },

      _hierarchyMove: function(items, target, meta) {
         if (!meta.parentProperty) {
            return CoreDeferred.fail('Parent property is not defined');
         }
         var parentValue = target ? target.get(this._$idProperty) : null;
         items.forEach(function(item) {
            item.set(meta.parentProperty, parentValue);
         }.bind(this));
         return new CoreDeferred().callback();
      },
      /**
       * Возвращает адаптер для работы с таблицей
       * @return {WS.Data/Adapter/ITable}
       * @protected
       */
      _getTableAdapter: function () {
         return this._tableAdapter || (this._tableAdapter = this.getAdapter().forTable(this._$data));
      },

      /**
       * Применяет источник выборки
       * @param {String} [from] Источник выборки
       * @return {*}
       * @protected
       */
      _applyFrom: function (from) {
         from = from || '';
         return from ? _static.contracts[from] : this._$data;
      },

      /**
       * Применяет объединение
       * @param {*} data Данные
       * @param {WS.Data/Query/Join[]} join Выборки для объединения
       * @return {*}
       * @protected
       */
      _applyJoin: function (data, join) {
         if (join.length) {
            throw new Error('Joins are not supported');
         }
         return data;
      },

      /**
       * Применяет фильтр
       * @param {*} data Данные
       * @param {Object} where Фильтр
       * @return {*}
       * @protected
       */
      _applyWhere: function (data, where) {
         where = where || {};
         if (Object.isEmpty(where)) {
            return data;
         }

         var adapter = this.getAdapter(),
            tableAdapter = adapter.forTable(),
            skipFields = {
               'Разворот': true,
               'ВидДерева': true,
               usePages: true
            };
         this._each(data, function(item) {
            var isMatch = true;

            //TODO: разбор выражений в filterField, вида 'date>'
            for (var filterField in where) {
               if (!where.hasOwnProperty(filterField)) {
                  continue;
               }
               //FIXME: избавиться от этого sbis-specified
               if (skipFields.hasOwnProperty(filterField)) {
                  continue;
               }
               isMatch = this._compareValues(
                  adapter.forRecord(item).get(filterField),
                  where[filterField],
                  '='
               );
               if (!isMatch) {
                  break;
               }
            }

            if (isMatch) {
               tableAdapter.add(item);
            }
         }, this);

         return tableAdapter.getData();
      },

      /**
       * Применяет сортировку
       * @param {*} data Данные
       * @param {Array.<WS.Data/Query/Order>} order Параметры сортировки
       * @return {*}
       * @protected
       */
      _applyOrderBy: function (data, order) {
         order = order || [];
         if (!order.length) {
            return data;
         }

         //Создаем карту сортировки
         var orderMap = [],
            i;
         for (i = order.length - 1; i >= 0; i--) {
            orderMap.push({
               field: order[i].getSelector(),
               order: order[i].getOrder()
            });
         }

         //Создаем служебный массив, который будем сортировать
         var adapter = this.getAdapter(),
            dataMap = [],
            values = [],
            value;
         this._each(data, function(item, index) {
            values = [];
            for (var i = 0; i < orderMap.length; i++) {
               value = adapter.forRecord(item).get(orderMap[i].field);
               //undefined значения не передаются в compareFunction Array.prototype.sort, и в результате сортируются непредсказуемо. Поэтому заменим их на null.
               values.push(value === undefined ? null : value);
            }
            dataMap.push({
               index: index,
               values: values
            });
         }, this);

         //Сортируем служебный массив
         var orderIndex,
            sortHandler = function (a, b) {
               var res;
               if (a.values[orderIndex] === null && b.values[orderIndex] !== null) {
                  //Считаем null меньше любого не-null
                  res = -1;
               } else if (a.values[orderIndex] !== null && b.values[orderIndex] === null) {
                  //Считаем любое не-null больше null
                  res = 1;
               } else if (a.values[orderIndex] == b.values[orderIndex]) {
                  res = 0;
               } else {
                  res = a.values[orderIndex] > b.values[orderIndex] ? 1 : -1;
               }
               return orderMap[orderIndex].order ? -res : res;
            };
         for (orderIndex = 0; orderIndex < orderMap.length; orderIndex++) {
            dataMap.sort(sortHandler);
         }

         //Создаем новую таблицу по служебному массиву
         var sourceAdapter = adapter.forTable(data),
            resultAdapter = adapter.forTable(),
            count;
         for (i = 0, count = dataMap.length; i < count; i++) {
            resultAdapter.add(
               sourceAdapter.at(dataMap[i].index)
            );
         }

         return resultAdapter.getData();
      },

      /**
       * Применяет срез
       * @param {*} data Данные
       * @param {Number} [offset=0] Смещение начала выборки
       * @param {Number} [limit] Количество записей выборки
       * @return {*}
       * @protected
       */
      _applyPaging: function (data, offset, limit) {
         offset = offset || 0;
         if (offset === 0 && limit === undefined) {
            return data;
         }

         var dataAdapter = this.getAdapter().forTable(data);
         if (limit === undefined) {
            limit = dataAdapter.getCount();
         } else {
            limit = limit || 0;
         }

         var newDataAdapter = this.getAdapter().forTable(),
            newIndex = 0,
            beginIndex = offset,
            endIndex = Math.min(
               dataAdapter.getCount(),
               beginIndex + limit
            ),
            index;
         for (index = beginIndex; index < endIndex; index++, newIndex++) {
            newDataAdapter.add(
               dataAdapter.at(index)
            );
         }

         return newDataAdapter.getData();
      },

      /**
       * Возвращает данные пустой выборки с учетом того, что в ней может содержаться описание полей (зависит от используемого адаптера)
       * @param {WS.Data/Query/Query} [query] Запрос
       * @return {*}
       * @protected
       */
      _getEmptyData: function(query) {
         var table = query ? query.getFrom() : undefined,
            items,
            adapter;

         this._emptyData = this._emptyData || {};

         if (!this._emptyData.hasOwnProperty(table)) {
            items = Utils.clone(this._applyFrom(table));
            adapter = this.getAdapter().forTable(items);

            adapter.clear();
            this._emptyData[table] = adapter.getData();
         }

         return this._emptyData[table];
      },

      /**
       * Сравнивает 2 значения на соответствие оператору
       * @param {*} given Имеющееся значение
       * @param {*} expect Ожидаемое значение
       * @param {String} operator Оператор
       * @return {Boolean}
       * @protected
       */
      _compareValues: function (given, expect, operator) {
         var i;

         //If array expected, use "given in expect" logic
         if (expect instanceof Array) {
            for (i = 0; i < expect.length; i++) {
               if (this._compareValues(given, expect[i], operator)) {
                  return true;
               }
            }
            return false;
         }

         //If array given, use "given has only expect" logic
         if (given instanceof Array) {
            for (i = 0; i < given.length; i++) {
               if (!this._compareValues(given[i], expect, operator)) {
                  return false;
               }
            }
            return true;
         }

         //Otherwise jsut compare
         return given == expect;
      },

      /**
       * Перестраивает индекс
       * @protected
       */
      _reIndex: function () {
         this._index = {};
         var key;
         this._each(this._$data, function(item, index) {
            key = this.getAdapter().forRecord(item).get(
               this._$idProperty
            );
            this._index[key] = index;
         }, this);
      },

      /**
       * Возвращает данные модели с указанным ключом
       * @param {String} key Значение ключа
       * @return {Array|undefined}
       * @protected
       */
      _getRecordByKey: function (key) {
         return this._getTableAdapter().at(
            this._getIndexByKey(key)
         );
      },

      /**
       * Возвращает индекс модели с указанным ключом
       * @param {String} key Значение ключа
       * @return {Number} -1 - не найден, >=0 - индекс
       * @protected
       */
      _getIndexByKey: function (key) {
         var index = this._index[key];
         return index === undefined ? -1 : index;
      },

      /**
       * выполняет удаление записи
       * @param key - идентификатор записи
       * @return {boolean}
       * @protected
       */
      _destroy: function (key) {
         var index = this._getIndexByKey(key);
         if(index !== -1) {
            this._getTableAdapter().remove(index);
            this._reIndex();
            return true;
         } else {
            return false;
         }
      }

      //endregion Protected methods
   });

   /**
    * Статические свойства
    */
   var _static = {
      /**
       * @member {Object.<String, Object>} Хранилище контрактов
       * @static
       */
      contracts: {}
   };

   Di.register('source.memory', Memory);

   return Memory;
});
