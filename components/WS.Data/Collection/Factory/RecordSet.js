/* global define */
define('js!WS.Data/Collection/Factory/RecordSet', [
   'js!WS.Data/Collection/RecordSet',
   'Core/core-instance'
], function (
   RecordSet,
   CoreInstance
) {
   'use strict';

   /**
    * Фабрика для получения рекордсета из WS.Data/Collection/IEnumerable.
    * @class WS.Data/Collection/Factory/RecordSet
    * @public
    * @author Мальцев Алексей
    */

   /**
    * @alias WS.Data/Collection/Factory/RecordSet
    * @param {WS.Data/Collection/IEnumerable.<WS.Data/Entity/Record>} items Коллекция записей
    * @param {Object} options Опции конструктора рекордсета
    * @return {WS.Data/Collection/RecordSet}
    */
   return function recordSetFactory(items, options) {
      if (!CoreInstance.instanceOfMixin(items, 'WS.Data/Collection/IEnumerable')) {
         throw new TypeError('Argument "items" should implement WS.Data/Collection/IEnumerable');
      }

      options = options || {};
      delete options.rawData;

      var result = new RecordSet(options);
      items.each(function(item) {
         result.add(item);
      });

      return result;
   };
});
