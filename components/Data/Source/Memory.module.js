/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Memory', [
   'js!SBIS3.CONTROLS.Data.Source.Local',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Local, DataSet, Di, Utils) {
   'use strict';

   /**
    * Источник данных в памяти ОС
    * @class SBIS3.CONTROLS.Data.Source.Memory
    * @extends SBIS3.CONTROLS.Data.Source.Local
    * @public
    * @author Мальцев Алексей
    */

   var Memory = Local.extend(/** @lends SBIS3.CONTROLS.Data.Source.Memory.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.Memory',
      $protected: {
         _options: {
            /**
             * @cfg {Object|SBIS3.CONTROLS.Data.Collection.IList} Данные, с которыми работает источник.
             * @remark
             * Данные должны быть в формате, поддерживаемом адаптером {@link adapter}
             * @example
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
             *          {id: 9, name: 'Neptune', kind: 'Planet'}
             *          {id: 10, name: 'Pluto', kind: 'Dwarf planet'}
             *       ],
             *       idProperty: 'id'
             *    });
             * </pre>
             * @example
             * <pre>
             *    //Use {@link SBIS3.CONTROLS.Data.Collection.RecordSet} as data for the source
             *    var solarData = new RecordSet({
             *       rawData: [
             *          {id: 1, name: 'Sun', kind: 'Star'},
             *          {id: 2, name: 'Mercury', kind: 'Planet'},
             *          {id: 3, name: 'Venus', kind: 'Planet'},
             *          {id: 4, name: 'Earth', kind: 'Planet'},
             *          {id: 5, name: 'Mars', kind: 'Planet'},
             *          {id: 6, name: 'Jupiter', kind: 'Planet'},
             *          {id: 7, name: 'Saturn', kind: 'Planet'},
             *          {id: 8, name: 'Uranus', kind: 'Planet'},
             *          {id: 9, name: 'Neptune', kind: 'Planet'}
             *          {id: 10, name: 'Pluto', kind: 'Dwarf planet'}
             *       ] 
             *    });
             *    //Use {@link SBIS3.CONTROLS.Data.Adapter.RecordSet} as adapter
             *    var solarSystem = new MemorySource({
             *       data: solarData,
             *       adapter: 'adapter.recordset',
             *       idProperty: 'id'
             *    });
             * </pre>
             */
            data: []
         },

         /**
          * @member {SBIS3.CONTROLS.Data.Adapter.ITable} Адаптер для таблицы
          */
         _tableAdapter: null,

         /**
          * @member {Object} Индекс для быстрого поиска записи по ключу
          */
         _index: {}
      },

      $constructor: function (cfg) {
         cfg = cfg || {};
         if (this._options.endpoint.contract && !_static.contracts.hasOwnProperty(this._options.endpoint.contract)) {
            _static.contracts[this._options.endpoint.contract] = this._options.data;
         }
         if ('strategy' in cfg && !('adapter' in cfg)) {
            this._options.adapter = cfg.strategy;
            Utils.logger.stack(this._moduleName + '::$constructor(): option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.', 1);
         }
         if ('keyField' in cfg && !('idProperty' in cfg)) {
            this._options.idProperty = cfg.keyField;
            Utils.logger.stack(this._moduleName + '::$constructor(): option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.', 1);
         }
         this._reIndex();
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      create: function (meta) {
         return $ws.proto.Deferred.success(
            this._prepareCreateResult(meta)
         );
      },

      read: function (key) {
         var data = this._getModelByKey(key);
         if (data) {
            return $ws.proto.Deferred.success(
               this._prepareReadResult(data)
            );
         } else {
            return $ws.proto.Deferred.fail(
               'Record with key "' + key + '" is not exists'
            );
         }
      },

      update: function (data) {
         var
            _update = function(model) {
               var idProperty = this.getIdProperty(),
                  key = idProperty ? model.get(idProperty) : null;
               if (!key) {
                  key = $ws.helpers.randomId('k');
               }

               var adapter = this._getTableAdapter(),
                  index = this._getIndexByKey(key);
               if (index === -1) {
                  adapter.add(
                     model.getRawData()
                  );
                  this._index[key] = adapter.getCount() - 1;
               } else {
                  adapter.replace(
                     model.getRawData(),
                     index
                  );
               }
               return key;
            }, key,
            self = this;

         if($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet')){
            data.each(function(model){
               _update.call(self, model);
            });
         } else {
            key = _update.call(self, data);
         }
         return $ws.proto.Deferred.success(
            this._prepareUpdateResult(data, key)
         );
      },

      destroy: function (keys) {
         if ($ws.helpers.type(keys) !== 'array') {
            keys = [keys];
         }
         for (var i = 0, len = keys.length; i < len; i++) {
            if (!this._destroy(keys[i])) {
               return $ws.proto.Deferred.fail('Model with key "' + keys[i] + '" isn\'t found');
            }
         }
         return $ws.proto.Deferred.success(true);
      },

      copy: function(key) {
         var index = this._getIndexByKey(key);
         if (index === -1) {
            return $ws.proto.Deferred.fail('Model with key "' + key + '" isn\'t found');
         } else {
            this._getTableAdapter().copy(index);
            this._reIndex();
            return $ws.proto.Deferred.success(true);
         }
      },

      merge: function(from, to) {
         var indexOne = this._getIndexByKey(from),
            indexTwo = this._getIndexByKey(to);
         if (indexOne === -1 || indexTwo === -1) {
            return $ws.proto.Deferred.fail('Model with key "' + from + '" or "' + to + '" isn\'t exists');
         } else {
            this._getTableAdapter().merge(
               indexOne,
               indexTwo,
               this.getIdProperty()
            );
            this._reIndex();
            return $ws.proto.Deferred.success(true);
         }
      },

      query: function (query) {
         var items = this._applyFrom(query ? query.getFrom() : undefined),
            total;
         if (query) {
            items = this._applyJoin(items, query.getJoin());
            items = this._applyWhere(items, query.getWhere());
            items = this._applyOrderBy(items, query.getOrderBy());
            total = this.getAdapter().forTable(items).getCount();
            items = this._applyPaging(items, query.getOffset(), query.getLimit());
         } else {
            total = this.getAdapter().forTable(items).getCount();
         }

         return $ws.proto.Deferred.success(
            this._prepareQueryResult({
               items: items,
               total: total
            }, 'items', 'total')
         );
      },

      call: function (command, data) {
         data = data || {};
         switch(command) {
            case 'move':
               return this._move(data.from, data.to, data.details);
         }
         throw new Error('Not supported');
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Protected methods

      _move: function (from, to, details) {
         details = details || {};
         var sourceKey =  from.get(this._options.idProperty),
            sourcePosition = this._getIndexByKey(sourceKey),
            targetPosition = -1;
         if (to) {
            var toKey = to.get(this._options.idProperty),
               tableAdapter = this._getTableAdapter();
            if (details.column && details.column !== this._options.idProperty) {
               //TODO: indexed search
               var adapter = this.getAdapter();
               for (var index = 0, count = tableAdapter.getCount(); index < count; index++) {
                  if (toKey === adapter.forRecord(
                        tableAdapter.at(index)
                     ).get(
                        details.column
                     )
                  ) {
                     targetPosition = index;
                     break;
                  }

               }
            } else {
               targetPosition = this._getIndexByKey(toKey);
            }
            if (targetPosition === -1) {
               return $ws.proto.Deferred().fail('Can\'t find target position');
            }
            if (details.after && sourcePosition > targetPosition) {
               targetPosition++;
            }
            tableAdapter.move(sourcePosition, targetPosition);
            this._reIndex();

         }
         return new $ws.proto.Deferred().callback(true);
      },

      /**
       * Возвращает адаптер для работы с таблицей
       * @returns {SBIS3.CONTROLS.Data.Adapter.ITable}
       * @protected
       */
      _getTableAdapter: function () {
         return this._tableAdapter || (this._tableAdapter = this.getAdapter().forTable(this._options.data));
      },

      /**
       * Применяет источник выборки
       * @param {String} [from] Источник выборки
       * @returns {*}
       * @protected
       */
      _applyFrom: function (from) {
         from = from || '';
         var adapter = this.getAdapter().forTable();
         this._each(
            from ? _static.contracts[from] : this._options.data,
            function(item) {
               adapter.add(item);
            }
         );
         return adapter.getData();
      },

      /**
       * Применяет объединение
       * @param {*} data Данные
       * @param {SBIS3.CONTROLS.Data.Query.Join[]} join Выборки для объединения
       * @returns {*}
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
       * @returns {*}
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
            },
            compare = function(given, expect) {
               if (expect instanceof Array) {
                  for (var i = 0; i < expect.length; i++) {
                     if (compare(given, expect[i])) {
                        return true;
                     }
                  }
                  return false;
               }

               if (given && given instanceof Array) {
                  //FIXME: если в поле хранится массив, то ищем совпадение по любому из элементов (требуется для поддержки типа "Иерархия"). Возможно поможет разделение иерархии на 2 поля.
                  return $ws.helpers.reduce(given, function(prev, current) {
                     return prev || (current == expect);
                  }, false);
               }
               return given == expect;
            };
         this._each(data, function(item) {
            var filterMatch = true;

            //TODO: разбор выражений в filterField, вида 'date>'
            for (var filterField in where) {
               if (!where.hasOwnProperty(filterField)) {
                  continue;
               }
               //FIXME: избавиться от этого sbis-specified
               if (skipFields.hasOwnProperty(filterField)) {
                  continue;
               }
               filterMatch = compare(
                  adapter.forRecord(item).get(filterField),
                  where[filterField]
               );
               if (!filterMatch) {
                  break;
               }
            }

            if (filterMatch) {
               tableAdapter.add(item);
            }
         }, this);

         return tableAdapter.getData();
      },

      /**
       * Применяет сортировку
       * @param {*} data Данные
       * @param {Array.<SBIS3.CONTROLS.Data.Query.Order>} order Параметры сортировки
       * @returns {*}
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
               return orderMap[orderIndex].order ? res : -res;
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
       * @returns {*}
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
       * Перестраивает индекс
       * @protected
       */
      _reIndex: function () {
         this._index = {};
         var key;
         this._each(this._options.data, function(item, index) {
            key = this.getAdapter().forRecord(item).get(
               this._options.idProperty
            );
            this._index[key] = index;
         }, this);
      },

      /**
       * Возвращает данные модели с указанным ключом
       * @param {String} key Значение ключа
       * @returns {Array|undefined}
       * @protected
       */
      _getModelByKey: function (key) {
         return this._getTableAdapter().at(
            this._getIndexByKey(key)
         );
      },

      /**
       * Возвращает индекс модели с указанным ключом
       * @param {String} key Значение ключа
       * @returns {Number} -1 - не найден, >=0 - индекс
       * @protected
       */
      _getIndexByKey: function (key) {
         var index = this._index[key];
         return index === undefined ? -1 : index;
      },

      /**
       * выполняет удаление записи
       * @param key - идентификатор записи
       * @returns {boolean}
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
