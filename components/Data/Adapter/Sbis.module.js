/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Sbis', [
   'js!SBIS3.CONTROLS.Data.Adapter.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.SbisTable',
   'js!SBIS3.CONTROLS.Data.Adapter.SbisRecord',
   'js!SBIS3.CONTROLS.Data.Adapter.FieldType',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Model'
], function (Abstract, SbisTable, SbisRecord, FIELD_TYPE, Di) {
   'use strict';

   /**
    * Адаптер для данных в формате СБиС
    * @class SBIS3.CONTROLS.Data.Adapter.Sbis
    * @extends SBIS3.CONTROLS.Data.Adapter.Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Sbis = Abstract.extend(/** @lends SBIS3.CONTROLS.Data.Adapter.Sbis.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.Sbis',

      forTable: function (data) {
         return new SbisTable(data);
      },

      forRecord: function (data) {
         return new SbisRecord(data);
      },

      getKeyField: function (data) {
         return (new SbisRecord(data)).getKeyField();
      },

      serialize: function (data) {
         return serializer.serialize(data);
      }
   });

   Sbis.FIELD_TYPE = FIELD_TYPE;

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

   Di.register('adapter.sbis', Sbis);

   return Sbis;
});
