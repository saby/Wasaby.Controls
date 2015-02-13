/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyArray', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';

   /**
    * Реализация интерфеса IDataStrategy для работы с массивами
    */

   return IDataStrategy.extend({
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

      /**
       * Получить сырые данные для записи по ключевому полю
       * @param {Array} data массив "сырых" данных
       * @param {String} keyField название поля-идентификатора
       * @param {Number} key искомый идентификатор
       * @returns {*} соответствующие "сырые" данные для записи
       */
      getByKey: function (data, keyField, key) {
         var item,
            length = data.length;
         // ищем простым перебором
         for (var i = 0; i < length; i++) {
            if (data[i][keyField] == parseInt(key, 10)) {
               item = data[i];
            }
         }
         return item;
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

      /**
       * Найти запись в сырых данных по ее идентификатору
       * @param {Array} data массив "сырых" данных
       * @param {String} keyField название поля-идентификатора
       * @param {Number} key идентификатор записи
       * @returns {*}
       */
      findRawRecordByKey: function (data, keyField, key) {
         var index;
         //перебиаем массим исходных данных пока не найдем нужный элемент
         //TODO: сделать ошибку если такой записи не нашлось
         for (var i = 0; i < data.length; i++) {
            if (data[i][keyField] == parseInt(key, 10)) {
               index = i;
               break;
            }
         }
         return data[index];
      },

      /**
       * Обновить запись в сырых данных
       * @param {Array} data массив "сырых" данных
       * @param {String} keyField название поля-идентификатора
       * @param {js!SBIS3.CONTROLS.Record} record обновленная запись
       */
      updateRawRecordByKey: function (data, keyField, record) {
         var newRawData = record.getRaw(),
            key = newRawData[keyField];
         // проходим по исходному массиву, когда находим нужных элемент - заменяем
         for (var i = 0; i < data.length; i++) {
            if (data[i][keyField] == key) {
               data[i] = newRawData;
               break;
            }
         }
      },

      addRawRecord: function (data, keyField, record) {
         //TODO: просчет идентификатора
         // идентификатор берем на 1 больше, чем у последней записи
         //var newKey = data[data.length - 1][keyField] + 1;
         var newKey = data.length + 10;
         record.set(keyField, newKey);
         data.push(record.getRaw());
      },

      /**
       * Удалить элемент из массива
       * @param {Array} data массив "сырых" данных
       * @param {String} keyField название поля-идентификатора
       * @param {Number} key идентификатор записи
       */
      destroy: function (data, keyField, key) {
         var index;
         // проходим по исходному массиву, пока не найдем позицию искомого элемента
         for (var i = 0; i < data.length; i++) {
            if (data[i][keyField] == parseInt(key, 10)) {
               index = i;
               break;
            }
         }
         // удаляем эемент из исходного набора
         Array.remove(data, index);
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

         return newData;
      }


   });
});