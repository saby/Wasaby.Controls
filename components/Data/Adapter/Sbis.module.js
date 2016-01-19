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

      /**
       * Сериализует данные
       * @param {*} data
       * @returns {Object}
       * @static
       */
      serialize: function (data) {
         return serializer.serialize(data);
      }
   });

   Sbis.FIELD_TYPE = FIELD_TYPE;

   var serializer = (function() {
      var
         serialize = function(data) {
            if (data instanceof Array) {
               return serializeArray(data);
            } else if (data instanceof Object) {
               return serializeObject(data);
            } else {
               return data;
            }
         },

         serializeArray = function (arr) {
            var i,
               count,
               result;
            if (arr._type === 'recordset') {
               result = {
                  s: [],
                  d: []
               };
               var mapper = function(val) {
                  return arr[i][val.n];
               };
               for (i = 0, count = arr.length; i < count; i++) {
                  if (i === 0) {
                     result.s = makeS(arr[i]);
                  }
                  result.d.push($ws.helpers.map(result.s, mapper));
               }
            } else {
               result = $ws.helpers.map(arr, function(item) {
                  return serialize(item);
               });
            }

            return result;
         },

         serializeObject = function (obj) {
            if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Model')) {
               return $ws.core.merge({
                  _type: 'record'
               }, obj.getRawData() || {});
            } else if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Collection.RecordSet') || $ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Data.Source.DataSet')) {
               return $ws.core.merge({
                  _type: 'recordset'
               }, obj.getRawData() || {});
            } else if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.Record')) {
               return $ws.core.merge({
                  _type: 'record'
               }, obj.getRaw() || {});
            } else if ($ws.helpers.instanceOfModule(obj, 'SBIS3.CONTROLS.DataSet')) {
               return $ws.core.merge({
                  _type: 'recordset'
               }, obj.getRawData() || {});
            } else if (obj instanceof Date) {
               return obj.toSQL();
            } else {
               var result = {
                  d: [],
                  s: []
               };
               result.s = makeS(obj);
               result.d = makeD(obj, result.s);
               return result;
            }
         },

         getValueType = function (val) {
            switch (typeof val) {
               case 'boolean':
                  return Sbis.FIELD_TYPE.Boolean;
               case 'number':
                  if (val % 1 === 0) {
                     return Sbis.FIELD_TYPE.Integer;
                  }
                  return Sbis.FIELD_TYPE.Double;
               case 'string':
                  return Sbis.FIELD_TYPE.String;
               case 'object':
                  if (val === null) {
                     return Sbis.FIELD_TYPE.String;
                  } else if ($ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Model') || $ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Record')) {
                     return Sbis.FIELD_TYPE.Model;
                  } else if ($ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Collection.RecordSet') || $ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.DataSet') || $ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Source.DataSet')) {
                     return Sbis.FIELD_TYPE.RecordSet;
                  } else if (val instanceof Date) {
                     return Sbis.FIELD_TYPE.DateTime;
                  } else if (val instanceof Array) {
                     return {
                        n: Sbis.FIELD_TYPE.Array,
                        t: getValueType(val[0])
                     };
                  } else {
                     return Sbis.FIELD_TYPE.Model;
                  }
                  break;
            }
            return Sbis.FIELD_TYPE.String;
         },

         makeS = function (obj) {
            var s = [];
            for (var key in obj) {
               if (!obj.hasOwnProperty(key)) {
                  continue;
               }
               s.push({
                  n: key,
                  t: getValueType(obj[key])
               });
            }
            return s;
         },

         makeD = function (obj, s) {
            var d = [];
            for (var i = 0, count = s.length; i < count; i++) {
               d.push(serialize(obj[s[i].n]));
            }
            return d;
         };

      return {
         serialize: serialize
      };
   })();

   Di.register('adapter.sbis', Sbis);

   return Sbis;
});
