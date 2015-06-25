/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.StaticSource', [
   'js!SBIS3.CONTROLS.BaseSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet'
], function (BaseSource, Record, DataSet) {
   'use strict';

   /**
    * Класс для работы с массивами, как с источником данных.
    * @author Мануйлов Андрей
    * @public
    * @class SBIS3.CONTROLS.StaticSource
    * @extends SBIS3.CONTROLS.BaseSource
    */

   return BaseSource.extend({
      $protected: {
         _initialDataSet: undefined,
         _options: {
            /**
             * @cfg {Array} Исходный массив данных, с которым работает StaticSource
             */
            data: [],

            /**
             * @cfg {String} Название поля, являющегося первичных ключом
             * @example
             * <pre>
             *     <option name="keyField">@Заметка</option>
             * </pre>
             */
            keyField: '',

            /**
             * @cfg {Function|null} Сallback для фильтра массива данных в методе query()
             */
            dataFilterCallback: null
         }
      },

      $constructor: function (cfg) {
         // неявно создадим начальный датасет, с которым будем работать дальше
         this._initialDataSet = new DataSet({
            strategy: this.getStrategy(),
            data: cfg.data,
            keyField: this._options.keyField
         });
      },

      create: function () {
         var def = new $ws.proto.Deferred(),
            record = new Record({
               strategy: this.getStrategy(),
               raw: {},
               keyField: this._options.keyField
            });
         def.callback(record);
         return def;
      },

      read: function (id) {
         var def = new $ws.proto.Deferred();
         def.callback(this._initialDataSet.getRecordByKey(id));
         return def;
      },

      update: function (record) {
         if (!record.isCreated()) {
            var key = record.getKey();
            if (!key) {
               record.set(record.getKeyField(), $ws.helpers.randomId('k'));
            }
            record.setCreated(true);
         }
         record.setChanged(false);
         var def = new $ws.proto.Deferred();
         def.callback(true);
         return def;
      },

      destroy: function (id) {
         var def = new $ws.proto.Deferred(),
            strategy = this.getStrategy();
         strategy.destroy(this._options.data, this._options.keyField, id);
         def.callback(true);
         return def;
      },

      /**
       * Метод для получения набора записей из источника данных.
       * Возможно применение фильтрации, сортировки и выбора определённого количества записей с заданной позиции.
       * @param {Object} filter Параметры фильтрации вида - {property1: value, property2: value}.
       * @param {Array} sorting Параметры сортировки вида - [{property1: 'ASC'}, {property2: 'DESC'}].
       * @param {Number} offset Смещение начала выборки.
       * @param {Number} limit Количество возвращаемых записей.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения.
       * В колбэке придёт js!SBIS3.CONTROLS.DataSet - набор отобранных элементов.
       */
      query: function (filter, sorting, offset, limit) {
         var data = this._options.data;
         data = this._applyFilter(data, filter);
         data = this._applySorting(data, sorting);
         data = this._applyPaging(data, offset, limit);

         var DS = new DataSet({
            strategy: this.getStrategy(),
            data: data,
            keyField: this._options.keyField
         });

         var def = new $ws.proto.Deferred();
         def.callback(DS);
         return def;
      },

      /**
       * Установить callback для фильтра массива данных в методе query()
       * @param {Function} handler Callback для фильтра массива данных в методе query()
       */
      setDataFilterCallback: function (handler) {
         this._options.dataFilterCallback = handler;
      },

      /**
       * Применяет фильтр к массиву данных
       * @param {Array} data Массив данных
       * @param {Object} filter Параметры фильтрации вида - {property1: value, property2: value}
       * @returns {Array}
       */
      _applyFilter: function (data, filter) {
         filter = filter || {};
         if (Object.isEmpty(filter)) {
            return data;
         }

         var strategy = this.getStrategy(),
            newData = strategy.getEmptyRawData(),
            index = 0;
         strategy.each(data, function(dataItem) {
            var filterMatch = true;

            for (var filterField in filter) {
               if (filter.hasOwnProperty(filterField)) {
                  var filterValue = filter[filterField],
                      dataValue = strategy.value(dataItem, filterField);

                  //Если установлен фильтр-callback - используем его результат, иначе - проверяем полное совпадение значений
                  var callbackResult = this._options.dataFilterCallback ? this._options.dataFilterCallback(filterField, dataValue, filterValue) : undefined;
                  if (callbackResult === undefined) {
                     filterMatch = ((typeof dataValue == 'undefined') || (dataValue && dataValue == filterValue));
                  } else {
                     filterMatch = callbackResult;
                  }
               }

               if (!filterMatch) {
                  break;
               }
            }

            if (filterMatch) {
               strategy.replaceAt(newData, index, dataItem);
               index++;
            }
         }, this);

         return newData;
      },

      /**
       * Применяет сортировку к массиву данных
       * @param {Array} data Массив данных
       * @param {Array} sorting Параметры сортировки вида - [{property1: 'ASC'}, {property2: 'DESC'}]
       * @returns {Array}
       */
      _applySorting: function (data, sorting) {
         sorting = sorting || [];
         if (!sorting.length) {
            return data;
         }

         //TODO: сортировка по нескольким полям одновременно

         //Создаем карту сортировки
         var sortMap = [],
            sortIndex = 0;
         $ws.helpers.forEach(sorting, function (sortItem) {
            if (!Object.isEmpty(sortItem)) {
               for (var sortField in sortItem) {
                  if (sortItem.hasOwnProperty(sortField)) {
                     sortMap.push({
                        field: sortField,
                        order: sortItem[sortField]
                     });
                  }
               }
            }
         });

         //Создаем индексированый массив данных
         var strategy = this.getStrategy(),
             dataMap = [];
         strategy.each(data, function(dataItem) {
            var dataItemIndexed = {};
            for (sortIndex = 0; sortIndex < sortMap.length; sortIndex++) {
               var sortField = sortMap[sortIndex].field;
               dataItemIndexed[sortField] = strategy.value(dataItem, sortField);
            }
            dataMap.push({
               index: dataItemIndexed,
               item: dataItem
            });
         }, this);

         //Сортируем индексированый массив данных
         var sortItem,
             sortHandler = function (a, b) {
                if (a.index[sortItem.field] > b.index[sortItem.field]) {
                   return sortItem.order == 'DESC' ? -1 : 1;
                } else if (a.index[sortItem.field] < b.index[sortItem.field]) {
                   return sortItem.order == 'DESC' ? 1 : -1;
                }

                return 0;
             };
         for (sortIndex = 0; sortIndex < sortMap.length; sortIndex++) {
            sortItem = sortMap[sortIndex];
            dataMap.sort(sortHandler);
         }

         //Создаем новый массив данных по индексированному
         var newData = strategy.getEmptyRawData();
         for (var index = 0, count = dataMap.length; index < count; index++) {
            strategy.replaceAt(newData, index, dataMap[index].item);
         }

         return newData;
      },

      /**
       * Применяет срез к массиву данных
       * @param {Array} data Массив данных
       * @param {Number} offset Смещение начала выборки
       * @param {Number} limit Количество записей выборки
       * @returns {Array}
       */
      _applyPaging: function (data, offset, limit) {
         if (offset === undefined ||
             offset === null ||
             limit === undefined ||
             limit === null
         ) {
            return data;
         }

         var strategy = this.getStrategy(),
            newData = strategy.getEmptyRawData(),
            newIndex = 0,
            beginIndex = offset,
            endIndex = Math.min(
                strategy.getCount(data),
                beginIndex + limit
            );
         for (var index = beginIndex; index < endIndex; index++, newIndex++) {
            strategy.replaceAt(newData, newIndex, strategy.at(data, index));
         }

         return newData;
      },
      /**
       * Метод перемещения записи к другому родителю и смены порядковых номеров
       * @param {SBIS3.CONTROLS.Record} record - запись, которую необходимо перенести
       * @param {String} hierField - имя колонки с иерархией
       * @param {Number} parentKey - ключ нового родителя для записи
       * @param {Object} orderDetails - детали смены порядковых номеров. Объект со свойствами after и before: после или перед какой записью нужно вставить перемещаемую. В after и before должны находиться записи
       */
      move: function (record, hierField, parentKey, orderDetails) {
         if(parentKey || parentKey === null){
            record.set(hierField, parentKey);
         }
         if(orderDetails){
            var strategy = this.getStrategy();
            strategy.changeOrder(this._options.data, record, orderDetails);
         } else if(!parentKey && parentKey !== null){
            throw new Error('Не передано достаточно информации для перемещения');
         }
         return new $ws.proto.Deferred().callback(true);
      }

   });
});