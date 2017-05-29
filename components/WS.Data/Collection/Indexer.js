/* global define */
define('js!WS.Data/Collection/Indexer', [
   'Core/core-extend'
], function (
   CoreExtend
) {
   'use strict';

   /**
    * Индексатор коллекции
    * @class WS.Data/Collection/Indexer
    * @public
    * @author Мальцев Алексей
    */

   var Indexer = CoreExtend.extend(/** @lends WS.Data/Collection/Indexer.prototype */{
      _moduleName: 'WS.Data/Collection/Indexer',

      /**
       * @member {Object} Коллекция
       */
      _collection: null,

      /**
       * @member {Function} Метод, возвращающий кол-во элементов коллекции
       */
      _count: null,

      /**
       * @member {Function} Метод, возвращающий элемент коллекции по индексу
       */
      _at: null,

      /**
       * @member {Function} Метод, возвращающий значение свойства элемента коллекции
       */
      _prop: null,

      /**
       * @member {Object.<String, Object>} Индексы, распределенные по полям
       */
      _indices: null,

      /**
       * Конструктор
       * @param {Object} collection Коллекция
       * @param {Function: Number} count Метод, возвращающий кол-во элементов коллекции
       * @param {Function: Object} at Метод, возвращающий элемент коллекции по индексу
       * @param {Function} prop Метод, возвращающий значение свойства элемента коллекции
       */
      constructor: function $Indexer(collection, count, at, prop) {
         this._collection = collection;
         this._count = count;
         this._at = at;
         this._prop = prop;
         this.resetIndex();
      },

      //region Public methods

      /**
       * Возвращает индекс первого элемента с указанным значением свойства. Если такого элемента нет - вернет -1.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @return {Number}
       */
      getIndexByValue: function (property, value) {
         var indices = this.getIndicesByValue(property, value);
         return indices.length ? indices[0] : -1;
      },

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @return {Array.<Number>}
       */
      getIndicesByValue: function (property, value) {
         var index = this._getIndex(property);
         return index && index[value] ? index[value].slice() : [];
      },


      /**
       * Сбрасывает индекс
       */
      resetIndex: function () {
         this._indices = null;
      },

      /**
       * Обновляет индекс элементов
       * @param {Number} start С какой позиции
       * @param {Number} count Число обновляемых элементов
       */
      updateIndex: function (start, count) {
         var indices = this._indices,
            property;

         if (!indices) {
            return;
         }

         /*jshint -W089 */
         /* eslint-disable guard-for-in */
         for (property in indices) {
            this._updateIndex(property, start, count);
         }
         /* eslint-enable guard-for-in */
      },

      /**
       * Сдвигает индекс элементов
       * @param {Number} start С какой позиции
       * @param {Number} count Число сдвигаемых элементов
       * @param {Number} offset На сколько сдвинуть индексы
       */
      shiftIndex: function (start, count, offset) {
         var finish = start + count,
            i;
         this._eachIndexItem(function(data) {
            for (i = 0; i < data.length; i++) {
               if (data[i] >= start && data[i] < finish) {
                  data[i]+= offset;
               }
            }
         });
      },

      /**
       * Удаляет элементы из индекса
       * @param {Number} start С какой позиции
       * @param {Number} count Число удаляемых элементов
       */
      removeFromIndex: function (start, count) {
         var i,
            at;
         this._eachIndexItem(function(data) {
            for (i = 0; i < count; i++) {
               at = data.indexOf(start + i);
               if (at > -1) {
                  data.splice(at, 1);
               }
            }
         });
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Перебирает проиндексированные значения для всех свойств
       * @param {Function} callback Метод обратного вызова
       * @protected
       */
      _eachIndexItem: function (callback) {
         var indices = this._indices,
            values,
            property,
            value;

         if (!indices) {
            return;
         }

         /*jshint -W089 */
         /* eslint-disable guard-for-in */
         for (property in indices) {
            values = indices[property];
            for (value in values) {
               callback(values[value], value, property);
            }
         }
         /* eslint-enable guard-for-in */
      },

      /**
       * Возвращает индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @return {Array}
       * @protected
       */
      _getIndex: function (property) {
         if (!property) {
            return undefined;
         }
         if (!this._hasIndex(property)) {
            this._createIndex(property);
         }
         return this._indices[property];
      },

      /**
       * Проверяет наличие индекса для указанного свойства.
       * @param {String} [property] Название свойства.
       * @protected
       */
      _hasIndex: function (property) {
         return property && this._indices ? property in this._indices : false;
      },

      /**
       * Удаляет индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @protected
       */
      _deleteIndex: function (property) {
         delete this._indices[property];
      },

      /**
       * Создает индекс для указанного свойства.
       * @param {String} property Название свойства.
       * @protected
       */
      _createIndex: function (property) {
         if (!property) {
            return;
         }
         if (!this._indices) {
            this._indices = Object.create(null);
         }
         this._indices[property] = Object.create(null);

         this._updateIndex(property, 0, this._count(this._collection));
      },

      /**
       * Обновляет индекс указанного свойства
       * @param {String} property Название свойства.
       * @param {Number} start С какой позиции
       * @param {Number} count Число элементов
       * @protected
       */
      _updateIndex: function (property, start, count) {
         var index = this._indices[property],
            i,
            item,
            value,
            positions;

         if (!index) {
            return;
         }

         for (i = start; i < start + count; i++) {
            item = this._at(this._collection, i);
            value = this._prop(item, property);
            if (value instanceof Array) {
               value = '[' + value.join(',') + ']';
            }
            if (!(value in index)) {
               index[value] = [];
            }
            positions = index[value];
            positions.splice(
               Indexer._getPosition(positions, i),
               0,
               i
            );
         }
      }

      //region Protected methods
   });

      /**
       * Ищет позицию вставки значения в массив методом деления пополам.
       * @param {Array} items Массив, значения котрого отсортированы по возрастанию.
       * @param {Number} value Вставляемое значение
       * @return {Number}
       * @protected
       */
   Indexer._getPosition = function(items, value) {
      var count = items.length,
         distance = count,
         position = Math.floor(distance / 2),
         having;
      while (distance > 0 && position < count) {
         having = items[position];
         distance = Math.floor(distance / 2);
         if (having > value) {
            position -= distance;
         } else {
            position += Math.max(distance, 1);
         }
      }

      return position;
   };

   return Indexer;
});
