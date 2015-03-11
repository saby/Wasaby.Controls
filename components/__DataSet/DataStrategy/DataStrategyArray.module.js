/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyArray', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';

   /**
    * Реализация интерфеса IDataStrategy для работы с массивами
    */

   var DataStrategyArray = IDataStrategy.extend({
      $protected: {
      },
      $constructor: function () {
      },
      /**
       * Метод для обхода по сырым данным
       * @param {Array} data исходный массив по которому производится обход
       * @param {function} iterateCallback пользовательская функция обратного вызова
       * @param context контекст
       */
      each: function (data, iterateCallback, context) {
         var
            length = data.length;
         for (var i = 0; i < length; i++) {
            iterateCallback.call(context, data[i]);
         }
      },

      at: function (data, index) {
         return data[index];
      },

      rebuild: function (data, keyField) {
         var _pkIndex = {},
            length = data.length;
         for (var i = 0; i < length; i++) {
            _pkIndex[data[i][keyField]] = i;
         }
         return _pkIndex;
      },

      /**
       * Установить значение поля записи
       * @param {Array} data массив "сырых" данных
       * @param {String} field название поля, в которой производится запись значения
       * @param {Object} value новое значение
       * @returns {Object} новый объект "сырых" данных
       */
      setValue: function (data, field, value) {
         data = data || {};
         data[field] = value;
         return data;
      },

      /**
       * Получить значение поля записи
       * @param {Object} data "сырые" данные записи
       * @param {String} field название поля для получения значения
       * @returns {*}
       */
      value: function (data, field) {
         return data[field];
      },

      addRecord: function (data, record) {
         var rawData = record.getRaw();
         data.push(rawData);
      },

      getLength: function (data) {
         return data.length;
      },

      /**
       * Удалить элемент из массива
       * @param {Array} data массив "сырых" данных
       * @param {String} keyField название поля-идентификатора
       * @param {Number | Array} key идентификатор записи или массив идентификаторов
       */
      destroy: function (data, keyField, key) {
         var length = data.length;
         var compare = function (index, key) {
            if (data[index][keyField] == key) {
               // удаляем эемент из исходного набора
               Array.remove(data, index);
            }
         };
         // проходим по исходному массиву, пока не найдем позицию искомых элементов
         for (var i = length - 1; i >= 0; i--) {
            if (key instanceof Array) {
               $ws.helpers.forEach(key, function (value) {
                  compare(i, value);
               });
            } else {
               compare(i, key);
            }
         }
      },

      query: function (data, filter, sorting, offset, limit) {
         var newData = data;
         filter = filter || [];
         sorting = sorting || [];

         if (filter.length) {
            newData = [];
            $ws.helpers.forEach(filter, function (value) {
               if (!Object.isEmpty(value)) {
                  for (var i = 0; i < data.length; i++) {
                     var equal = true;
                     for (var j in value) {
                        if (value.hasOwnProperty(j)) {
                           if (data[i][j] != value[j]) {
                              equal = false;
                              break;
                           }
                        }
                     }
                     if (equal) {
                        newData.push(data[i]);
                     }
                  }
               }

            });
         }

         if (sorting.length) {
            //TODO: сортировка по нескольким полям одновременно

            $ws.helpers.forEach(sorting, function (value) {

               if (!Object.isEmpty(value)) {

                  for (var j in value) {
                     if (value.hasOwnProperty(j)) {

                        newData.sort(function (a, b) {

                           if (a[j] > b[j]) {
                              return (value[j] == 'ASC') ? -1 : 1;
                           }

                           if (a[j] < b[j]) {
                              return (value[j] == 'ASC') ? 1 : -1;
                           }

                           return 0;

                        });

                     }
                  }

               }

            });
         }

         var pagingData = newData;
         if (typeof(offset) != 'undefined' && offset != null && typeof(limit) != 'undefined' && limit != null) {
            pagingData = [];
            var
               firstIdx = offset*limit,
               length = newData.length;
            for (var i = firstIdx; i < firstIdx + limit; i++) {
               if (i >= length) {
                  break;
               }
               pagingData.push(newData[i]);
            }
         }

         return pagingData;
      }


   });

   return DataStrategyArray;
});