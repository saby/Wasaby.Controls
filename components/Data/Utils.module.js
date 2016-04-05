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

         if (item === null || typeof item !== 'object') {
            return undefined;
         }

         if (property in item) {
            return item[property];
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IObject') && item.has(property)) {
            return item.get(property);
         }

         var getter = this._getPropertyMethodName(property, 'get');
         if (typeof item[getter] === 'function') {
            return item[getter]();
         }

         return undefined;
      },

      /**
       * Устанавливает значение свойства элемента
       * @param {*} item Элемент.
       * @param {String} property Название свойства.
       * @param {*} value Значение свойства.
       * @static
       */
      setItemPropertyValue: function (item, property, value) {
         property = property || '';

         if (item === null || typeof item !== 'object') {
            throw new TypeError('Argument item should be an instance of Object');
         }

         if (property in item) {
            item[property] = value;
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IObject') && item.has(property)) {
            return item.set(property, value);
         }

         var setter = this._getPropertyMethodName(property, 'set');
         if (typeof item[setter] === 'function') {
            return item[setter](value);
         }

         throw new ReferenceError('Object doesn\'t have setter for property "' + property + '".');
      },

      _getPropertyMethodName: function (property, prefix) {
         return prefix + property.substr(0, 1).toUpperCase() + property.substr(1);
      }
   };
});
