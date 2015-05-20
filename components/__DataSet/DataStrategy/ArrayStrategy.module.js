/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.ArrayStrategy', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';

   /**
    * Реализация интерфеса IDataStrategy для работы с массивами.
    * Позволяет работать с массивом объектов на статике.
    * @author Мануйлов Андрей
    * @public
    */

   var ArrayStrategy = IDataStrategy.extend({
      $protected: {},
      $constructor: function () {
      },
       /**
        * Найти название поля, которое является идентификатором.
        * @param data
        * @returns {*}
        */
      getKey: function (data) {
         var
            key,
            keys = Object.keys(data);
         if (keys) {
            key = keys[0];
         }
         return key;
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
        *
        * @param {Array} data
        * @param index
        * @returns {*}
        */
      at: function (data, index) {
         return data[index];
      },
       /**
        *
        * @param {Array} data
        * @param index
        * @param newRaw
        */
      replaceAt: function (data, index, newRaw) {
         data[index] = newRaw;
      },
       /**
        *
        * @param {Array} data
        * @param {String} keyField название поля-идентификатора
        * @returns {Array}
        */
      rebuild: function (data, keyField) {
         var _indexId = [],
            length = data.length;
         for (var i = 0; i < length; i++) {
            _indexId[i] = data[i][keyField];
         }
         return _indexId;
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
       * Получить тип поля
       * Rem:  В статических данных нет типов, всегда вернется "Текст"
       * @param {Object} data "сырые" данные записи
       * @param {String} field название поля для получения значения
       * @returns {*}
       */
      type: function (data, field) {
         return 'Текст';
      },
       /**
        * Метод добавления записи.
        * @param {Array} data
        * @param record
        * @param at
        */
      addRecord: function (data, record, at) {
         var rawData = record.getRaw();
         if (at) {
            data.splice(at, 0, rawData);
         } else {
            data.push(rawData);
         }
      },
       /**
        *
        * @param {Array} data
        * @returns {exports.length|*|Function|length|.__defineGetter__.length|Number}
        */
      getCount: function (data) {
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

      //TODO пустышка
      getMetaData: function (data) {
         return {
            more: data.length
         };
      },

      getParentKey: function (rawKey) {
         return rawKey;
      },
      getEmptyRawData: function () {
         return [];
      }

   });

   return ArrayStrategy;
});