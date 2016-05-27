/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Abstract', [
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.IAdapter',
   'js!SBIS3.CONTROLS.Data.SerializableMixin'
], function (AbstractEntity, IAdapter, SerializableMixin) {
   'use strict';

   /**
    * Абстрактный адаптер для данных
    * @class SBIS3.CONTROLS.Data.Adapter.Abstract
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Adapter.IAdapter
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Abstract = AbstractEntity.extend([IAdapter, SerializableMixin], /** @lends SBIS3.CONTROLS.Data.Adapter.Abstract.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.Abstract',

      /**
       * @member {String} Разделитель для обозначения пути в данных
       */
      _pathSeparator: '.',

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
         if (!data || !(data instanceof Object)) {
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
      },

      serialize: function (data) {
         return serializer.serialize(data);
      }
   });

   var serializer = (function() {
      var serialize = function(data) {
            if (data instanceof Array) {
               return serializeArray(data);
            } else if (data instanceof Object) {
               return serializeObject(data);
            } else {
               return data;
            }
         },
         serializeArray = function (arr) {
            return $ws.helpers.map(arr, function(item) {
               return serialize(item);
            });
         },
         serializeObject = function (obj) {
            if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Record') ||
               $ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Collection.RecordSet') ||
               $ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Source.DataSet')
            ) {
               return obj.getRawData();
            } else if (obj instanceof Date) {
               return obj.toSQL();
            } else {
               var result = {};
               for (var key in obj) {
                  if (obj.hasOwnProperty(key)) {
                     result[key] = serialize(obj[key]);
                  }
               }
               return result;
            }
         };

      return {
         serialize: serialize
      };
   })();

   return Abstract;
});
