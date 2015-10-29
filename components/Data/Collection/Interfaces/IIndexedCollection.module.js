/* global define */
define('js!SBIS3.CONTROLS.Data.Collection.IIndexedCollection', [], function () {
   'use strict';

   /**
    * Интерфейс коллеции c индексированным поиском элементов
    * @mixin SBIS3.CONTROLS.Data.Collection.IIndexedCollection
    * @public
    * @author Мальцев Алексей
    * @state mutable
    * @remark
    * Этот интерфейс временный. Не используйте его - он будет изменен.
    */

   return /** @lends SBIS3.CONTROLS.Data.Collection.IIndexedCollection.prototype */{
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
