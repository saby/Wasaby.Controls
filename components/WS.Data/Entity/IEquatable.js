/* global define */
define('js!WS.Data/Entity/IEquatable', [], function () {
   'use strict';

   /**
    * Интерфейс сравнения объектов.
    * @interface WS.Data/Entity/IEquatable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Entity/IEquatable.prototype */{
      _wsDataEntityIEquatable: true,

      /**
       * Проверяет эквивалентность текущего объекта другому объекту.
       * @param {Object} to Объект, с которым сравнивается текущий объект.
       * @return {Boolean}
       * @example
       * Проверим идентичность записей до и после изменения поля:
       * <pre>
       * requirejs(['js!WS.Data/Entity/Record'], function(Record) {
       *    var articleA = new Record({
       *          rawData: {
       *             foo: 'bar'
       *          }
       *       }),
       *       articleB = articleA.clone();
       *
       *    articleA.isEqual(articleB);//true
       *    articleA.set('title', 'New Title');
       *    articleA.isEqual(articleB);//false
       * });
       * </pre>
       */
      isEqual: function (to) {
         throw new Error('Method must be implemented');
      }
   };
});
