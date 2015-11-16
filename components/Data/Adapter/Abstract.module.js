/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Abstract', [
   'js!SBIS3.CONTROLS.Data.Adapter.IAdapter'
], function (IAdapter) {
   'use strict';

   /**
    * Абстрактный адаптер для данных
    * @class SBIS3.CONTROLS.Data.Adapter.Abstract
    * @mixes SBIS3.CONTROLS.Data.Adapter.IAdapter
    * @public
    * @author Мальцев Алексей
    */

   var Abstract = $ws.core.extend({}, [IAdapter], /** @lends SBIS3.CONTROLS.Data.Adapter.Abstract.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.Abstract',

      getProperty: function (data, property) {
         property = property || '';
         var parts = property.split('.'),
            result;
         for (var i = 0; i < parts.length; i++) {
            result = i ?
               (result ? result[parts[i]] : undefined) :
               (data ? data[parts[i]] : undefined);
         }
         return result;
      },

      setProperty: function (data, property, value) {
         if (!data || typeof data !== 'object') {
            return;
         }
         property = property || '';
         var parts = property.split('.'),
            current = data;
         for (var i = 0, max = parts.length - 1; i <= max; i++) {
            if (i === max) {
               current[parts[i]] = value;
            } else {
               if (current[parts[i]] === undefined) {
                  current[parts[i]] = {};
               }
               current = current[parts[i]];
            }
         }
      }
   });

   return Abstract;
});
