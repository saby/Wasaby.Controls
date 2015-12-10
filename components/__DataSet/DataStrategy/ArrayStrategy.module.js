/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.ArrayStrategy', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';

   /**
    * Реализация интерфейса SBIS3.CONTROLS.IDataStrategy для работы с массивами.
    * Позволяет работать с массивом объектов на статике.
    * @class SBIS3.CONTROLS.ArrayStrategy
    * @extends SBIS3.CONTROLS.IDataStrategy
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var ArrayStrategy = IDataStrategy.extend(/** @lends SBIS3.CONTROLS.ArrayStrategy.prototype */{
      $protected: {},
      $constructor: function () {
      },
       /**
        * Найти название поля, которое является идентификатором.
        * @param data
        * @returns {*}
        */
      getKey: function (data) {
         data = data || {};
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
         return field in data ? 'Текст' : undefined;
      },
       /**
        * Добавляет запись
        * @param {Array} data Массив "сырых" данных
        * @param {SBIS3.CONTROLS.Record} record Добавляемая запись
        * @param {Integer} [at] Позиция вставки (по умолчанию в конец)
        */
      addRecord: function (data, record, at) {
         var rawData = record.getRaw();
         if (at !== undefined && at >= 0) {
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
            more: data ? data.length : 0,
            path : [],
            results : {}
         };
      },

      getParentKey: function (record, rawKey) {
         return record.get(rawKey);
      },
      getEmptyRawData: function () {
         return [];
      },

      changeOrder: function(data, record, orderDetails){
         var orderColumn = orderDetails.column,
            targetOrder,
            recordKey = record.getKey(),
            length = data.length,
            shift = false,
            shiftSize,
            startKey,
            stopKey,
            rowKey,
            row;
         if(orderDetails.after){
            stopKey = orderDetails.after;
            startKey = recordKey;
            shiftSize = -1;
         } else {
            stopKey = recordKey;
            startKey = orderDetails.before;
            shiftSize = 1;
         }
         for (var i = 0; i < length; i++) {
            row = data[i];
            rowKey = this.getKey(row);
            if(!shift && rowKey === startKey){
               targetOrder = row[orderColumn];
               shift = true;
            }
            if(shift && rowKey === stopKey){
               shift = false;
               row[orderColumn] = targetOrder;
            }
            if(shift){
               row[orderColumn] = data[i + shiftSize][orderColumn];
            }
         }
      },
      setParentKey: function(record, hierField, parent) {
         record.set(hierField, parent);
      },

      getFullFieldData: function(data, name) {
         return {};
      }
   });

   return ArrayStrategy;
});