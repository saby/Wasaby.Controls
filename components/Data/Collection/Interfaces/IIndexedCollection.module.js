/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection', [], function () {
   'use strict';

   /**
    * Интерфейс коллеции c индексированным поиском элементов
    * @mixin SBIS3.CONTROLS.Data.Collection.IIndexedCollection
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Collection.IIndexedCollection.prototype */{
      /**
       * Возвращает элемент списка с указанным хэшем
       * @param {String} hash Хеш элемента
       * @returns {SBIS3.CONTROLS.Data.Collection.CollectionItem}
       */
      getItemByHash: function (hash) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает индекс элемента списка с указанным хэшем
       * @param {String} hash Хеш элемента
       * @returns {Number}
       */
      getItemIndexByHash: function (hash) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает первый элемент с указанным значением свойства. Если такого элемента нет - вернет undefined.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {*}
       */
      getItemByPropertyValue: function (property, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает все элементы с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Array}
       */
      getItemsByPropertyValue: function (property, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает индекс первого элемента с указанным значением свойства. Если такого элемента нет - вернет -1.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Number}
       */
      getItemIndexByPropertyValue: function (property, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @returns {Array}
       */
      getItemsIndexByPropertyValue: function (property, value) {
         throw new Error('Method must be implemented');
      }
   };
});
