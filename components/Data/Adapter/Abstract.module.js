/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Abstract', [
   'js!SBIS3.CONTROLS.Data.Adapter.IAdapter',
   'js!SBIS3.CONTROLS.Data.SerializableMixin'
], function (IAdapter, SerializableMixin) {
   'use strict';

   /**
    * Абстрактный адаптер для данных
    * @class SBIS3.CONTROLS.Data.Adapter.Abstract
    * @mixes SBIS3.CONTROLS.Data.Adapter.IAdapter
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Abstract = $ws.core.extend({}, [IAdapter, SerializableMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.Abstract.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.Abstract',
      $protected: {
         /**
          * @member {String} Разделитель для обозначения пути в данных
          */
         _pathSeparator: '.'
      },

      getProperty: function (data, property) {
         property = property || '';
         var parts = property.split(this._pathSeparator),
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
         var parts = property.split(this._pathSeparator),
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
