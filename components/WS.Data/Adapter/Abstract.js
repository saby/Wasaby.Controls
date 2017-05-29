/* global define */
define('js!WS.Data/Adapter/Abstract', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/IAdapter',
   'js!WS.Data/Entity/SerializableMixin',
   'Core/helpers/collection-helpers'
], function (
   AbstractEntity,
   IAdapter,
   SerializableMixin,
   CollectionHelpers
) {
   'use strict';

   /**
    * Абстрактный адаптер для данных.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Adapter/Abstract
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/IAdapter
    * @mixes WS.Data/Entity/SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Abstract = AbstractEntity.extend([IAdapter, SerializableMixin], /** @lends WS.Data/Adapter/Abstract.prototype */{
      _moduleName: 'WS.Data/Adapter/Abstract',

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
            return CollectionHelpers.map(arr, function(item) {
               return serialize(item);
            });
         },
         serializeObject = function (obj) {
            if (typeof obj.getRawData === 'function') {//CoreInstance.instanceOfModule(obj, 'WS.Data/Entity/Record') || CoreInstance.instanceOfModule(obj, 'WS.Data/Collection/RecordSet') || CoreInstance.instanceOfModule(obj, 'WS.Data/Source/DataSet')
               return obj.getRawData();
            } else if (obj instanceof Date) {
               return obj.toSQL(Date.SQL_SERIALIZE_MODE_AUTO);
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
