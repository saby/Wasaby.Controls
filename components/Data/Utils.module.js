/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Utils', [], function () {
   'use strict';

   /**
    * Утилиты для коллекций
    * @class SBIS3.CONTROLS.Data.Utils
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Utils.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Utils',

      /**
       * Возвращает значение свойства элемента
       * @param {*} item Элемент.
       * @param {String} property Название свойства.
       * @static
       */
      getItemPropertyValue: function (item, property) {
         property = property || '';

         if (item === null) {
            return undefined;
         }

         if (typeof item !== 'object') {
            return undefined;
         }

         if (property in item) {
            return item[property];
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IPropertyAccess') && item.has(property)) {
            return item.get(property);
         }

         var getter = 'get' + property.substr(0, 1).toUpperCase() + property.substr(1);
         if (typeof item[getter] === 'function') {
            return item[getter]();
         }

         return undefined;
      }
   };
});
