/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Memory', [
   'js!SBIS3.CONTROLS.Data.Source.Base',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (Base, DataSet, JsonAdapter) {
   'use strict';

   /**
    * Источник данных в памяти ОС
    * @class SBIS3.CONTROLS.Data.Source.Memory
    * @extends SBIS3.CONTROLS.Data.Source.Base
    * @public
    * @author Мальцев Алексей
    */

   var Memory = Base.extend(/** @lends SBIS3.CONTROLS.Data.Source.Memory.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.Memory',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию SBIS3.CONTROLS.Data.Adapter.Json
             */
            adapter: undefined,

            /**
             * @cfg {*} Исходные данные
             */
            data: undefined
         },

         /**
          * @var {Object} Индекс для быстрого поиска записи по ключу
          */
         _index: {}
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         this._options.adapter = 'adapter' in cfg ? cfg.adapter : new JsonAdapter();
         this._options.data = 'data' in cfg ? cfg.data : [];
         if (_static.resources[this._options.resource] === undefined) {
            _static.resources[this._options.resource] = this._options.data;
         }

         this._reIndex();
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      create: function () {
         return $ws.proto.Deferred.success(this._getModelInstance(
            this._options.adapter.forRecord().getEmpty()
         ));
      },

      read: function (key) {
         var data = this._getModelByKey(key);
         if (data) {
            var model = this._getModelInstance(data);
            model.setStored(true);
            return $ws.proto.Deferred.success(model);
         } else {
            return $ws.proto.Deferred.fail('Model instance is not exists');
         }
      },

      update: function (model) {
         if (!model.isStored() && !model.get(this._options.modelIdField)) {
            model.set(
               this._options.modelIdField,
               $ws.helpers.randomId('k')
            );
         }

         var adapter = this._options.adapter.forTable(),
             key = model.get(this._options.modelIdField),
             index = this._getIndexByKey(key);
         if (index === -1) {
            adapter.add(
               this._options.data,
               model.getData()
            );
            this._index[key] = adapter.getCount(this._options.data) - 1;
         } else {
            adapter.replace(
               this._options.data,
               model.getData(),
               index
            );
         }
         model.setStored(true);

         return $ws.proto.Deferred.success(true);
      },

      destroy: function (key) {
         var index = this._getIndexByKey(key);
         if (index === -1) {
            return $ws.proto.Deferred.fail('Model instance is not exists');
         } else {
            this._options.adapter.forTable().remove(
               this._options.data,
               index
            );
            delete this._index[key];

            return $ws.proto.Deferred.success(true);
         }
      },

      query: function (query) {
         var adapter = this._options.adapter.forTable();
         var items = this._applyFrom(query.getFrom());
         items = this._applyJoin(items, query.getJoin());
         items = this._applyWhere(items, query.getWhere());
         items = this._applyOrderBy(items, query.getOrderBy());
         items = this._applyPaging(items, query.getOffset(), query.getLimit());

         return $ws.proto.Deferred.success(new DataSet({
            source: this,
            data: {
               items: items,
               total: adapter.getCount(this._options.data)
            },
            itemsProperty: 'items',
            totalProperty: 'total'
         }));
      },

      call: function () {
         throw new Error('Not supported');
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Protected methods

      /**
       * Применяет ресурс
       * @param {String} [from] Ресурс
       * @returns {*}
       * @private
       */
      _applyFrom: function (from) {
         from = from || '';
         var adapter = this._options.adapter.forTable(),
            items = adapter.getEmpty(this._options.data);
         this._each(
            from === this._options.resource ? this._options.data : _static.resources[from],
            function(item) {
               adapter.add(items, item);
            }
         );
         return items;
      },

      /**
       * Применяет объединение
       * @param {*} data Данные
       * @param {SBIS3.CONTROLS.Data.Query.Join[]} join Выборки для объединения
       * @returns {*}
       * @private
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
       * @private
       */
      _applyWhere: function (data, where) {
         where = where || {};
         if (Object.isEmpty(where)) {
            return data;
         }

         var tableAdapter = this._options.adapter.forTable(),
             recordAdapter = this._options.adapter.forRecord(),
             newData = tableAdapter.getEmpty();
         this._each(data, function(item) {
            var filterMatch = true;

            //TODO: разбор выражений в filterField, вида 'date>'
            for (var filterField in where) {
               if (!where.hasOwnProperty(filterField)) {
                  continue;
               }
               filterMatch = recordAdapter.get(item, filterField) == where[filterField];
               if (!filterMatch) {
                  break;
               }
            }

            if (filterMatch) {
               tableAdapter.add(newData, item);
            }
         }, this);

         return newData;
      },

      /**
       * Применяет сортировку
       * @param {*} data Данные
       * @param {SBIS3.CONTROLS.Data.Query.Order[]} order Параметры сортировки
       * @returns {*}
       * @private
       */
      _applyOrderBy: function (data, order) {
         order = order || [];
         if (!order.length) {
            return data;
         }

         //Создаем карту сортировки
         var tableAdapter = this._options.adapter.forTable(),
            recordAdapter = this._options.adapter.forRecord(),
            orderMap = [],
            i;
         for (i = order.length - 1; i >= 0; i--) {
            orderMap.push({
               field: order[i].getSelector(),
               order: order[i].getOrder()
            });
         }

         //Создаем служебный массив, который будем сортировать
         var dataMap = [];
         this._each(data, function(item, index) {
            var values = [];
            for (var i = 0; i < orderMap.length; i++) {
               values.push(recordAdapter.get(item, orderMap[i].field));
            }
            dataMap.push({
               index: index,
               values: values
            });
         }, this);

         //Сортируем служебный массив
         var orderIndex,
            sortHandler = function (a, b) {
               if (a.values[orderIndex] == b.values[orderIndex]) {
                  return 0;
               } else if (a.values[orderIndex] > b.values[orderIndex]) {
                  return orderMap[orderIndex].order ? 1 : -1;
               } else {
                  return orderMap[orderIndex].order ? -1 : 1;
               }
            };
         for (orderIndex = 0; orderIndex < orderMap.length; orderIndex++) {
            dataMap.sort(sortHandler);
         }

         //Создаем новую таблицу по служебному массиву
         var newData = tableAdapter.getEmpty(),
            count;
         for (i = 0, count = dataMap.length; i < count; i++) {
            tableAdapter.add(
               newData,
               tableAdapter.at(data, dataMap[i].index)
            );
         }

         return newData;
      },

      /**
       * Применяет срез
       * @param {*} data Данные
       * @param {Number} [offset=0] Смещение начала выборки
       * @param {Number} [limit] Количество записей выборки
       * @returns {*}
       * @private
       */
      _applyPaging: function (data, offset, limit) {
         offset = offset || 0;
         if (offset === 0 && limit === undefined) {
            return data;
         }

         var tableAdapter = this._options.adapter.forTable();

         if (limit === undefined) {
            limit = tableAdapter.getCount(data);
         } else {
            limit = limit || 0;
         }

         var newData = tableAdapter.getEmpty(),
            newIndex = 0,
            beginIndex = offset,
            endIndex = Math.min(
               tableAdapter.getCount(data),
               beginIndex + limit
            ),
            index;
         for (index = beginIndex; index < endIndex; index++, newIndex++) {
            tableAdapter.add(
               newData,
               tableAdapter.at(data, index)
            );
         }

         return newData;
      },

      /**
       * Перестраивает индекс
       * @private
       */
      _reIndex: function () {
         this._index = {};
         var recordAdapter = this._options.adapter.forRecord(),
             key;
         this._each(this._options.data, function(item, index) {
            key = recordAdapter.get(
               item,
               this._options.modelIdField
            );
            this._index[key] = index;
         }, this);
      },

      /**
       * Возвращает данные модели с указанным ключом
       * @param {String} key Значение ключа
       * @returns {Array|undefined}
       * @private
       */
      _getModelByKey: function (key) {
         return this._options.adapter.forTable().at(
            this._options.data,
            this._getIndexByKey(key)
         );
      },

      /**
       * Возвращает индекс модели с указанным ключом
       * @param {String} key Значение ключа
       * @returns {Number} -1 - не найден, >=0 - индекс
       * @private
       */
      _getIndexByKey: function (key) {
         var index = this._index[key];
         return index === undefined ? -1 : index;
      }

      //endregion Protected methods
   });

   /**
    * Статические свойства
    */
   var _static = {
      /**
       * @var {Object} Хранилище ресурсов
       * @static
       */
      resources: {}
   };

   return Memory;
});
