/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection', [], function () {
   'use strict';

   /**
    * Интерфейс коллеции c индексированным поиском элементов
    * @mixin SBIS3.CONTROLS.Data.Collection.IIndexedCollection
    * @author Мальцев Алексей
    * @public
    */

   return /** @lends SBIS3.CONTROLS.Data.Collection.IIndexedCollection.prototype */{
      /**
       * Возвращает индекс первого элемента с указанным значением свойства. Если такого элемента нет - вернет -1.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Number}
       */
      getIndexByValue: function (property, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Array.<Number>}
       */
      getIndiciesByValue: function (property, value) {
         throw new Error('Method must be implemented');
      }
   };
});
