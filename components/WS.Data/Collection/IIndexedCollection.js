/* global define */
define('js!WS.Data/Collection/IIndexedCollection', [], function () {
   'use strict';

   /**
    * Интерфейс коллекции с поиском элементов по значению свойств.
    * @interface WS.Data/Collection/IIndexedCollection
    * @author Мальцев Алексей
    * @public
    */

   return /** @lends WS.Data/Collection/IIndexedCollection.prototype */{
      /**
       * Возвращает индекс первого элемента с указанным значением свойства. Если такого элемента нет - вернет -1.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @return {Number}
       * @example
       * Получим индекс элемента со значением свойства id равным 5:
       * <pre>
       *    var list = new List({
       *       items: [
       *          {id: 1, title: 'One'}
       *          {id: 3, title: 'Three'}
       *          {id: 5, title: 'Five'}
       *       ]
       *    });
       *
       *    list.getIndexByValue('id', 5);//2
       * </pre>
       */
      getIndexByValue: function (property, value) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает индексы всех элементов с указанным значением свойства.
       * @param {String} property Название свойства элемента.
       * @param {*} value Значение свойства элемента.
       * @return {Array.<Number>}
       * @example
       * Получим индексы элементов со значением свойства node равным true:
       * <pre>
       *    var list = new List({
       *       items: [
       *          {id: 1, title: 'One', node: true}
       *          {id: 2, title: 'Two', node: true}
       *          {id: 3, title: 'Three', node: false}
       *          {id: 4, title: 'Four', node: true}
       *          {id: 5, title: 'Five', node: false}
       *       ]
       *    });
       *
       *    list.getIndicesByValue('node', true);//[0, 1, 3]
       * </pre>
       */
      getIndicesByValue: function (property, value) {
         throw new Error('Method must be implemented');
      }
   };
});
