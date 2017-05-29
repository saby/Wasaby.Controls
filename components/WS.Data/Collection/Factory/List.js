/* global define */
define('js!WS.Data/Collection/Factory/List', [
   'js!WS.Data/Collection/List',
   'Core/core-instance'
], function (
   List,
   CoreInstance
) {
   'use strict';

   /**
    * Фабрика для получения списка из WS.Data/Collection/IEnumerable.
    * @class WS.Data/Collection/Factory/List
    * @public
    * @author Мальцев Алексей
    */

   /**
    * @alias WS.Data/Collection/Factory/List
    * @param {WS.Data/Collection/IEnumerable} items Коллекция
    * @return {WS.Data/Collection/List}    *
    */
   return function listFactory(items) {
      if (!CoreInstance.instanceOfMixin(items, 'WS.Data/Collection/IEnumerable')) {
         throw new TypeError('Argument "items" should implement WS.Data/Collection/IEnumerable');
      }

      var result = new List();
      items.each(function(item) {
         result.add(item);
      });
      return result;
   };
});
