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
         //TODO: имя поля с ПК может лежать в this._data.k (при этом может принимать значение -1)
         var index, s;
         if(data && data.s) {
            s = data.s;
            for (var i = 0, l = s.length; i < l; i++) {
               if (s[i].n && s[i].n[0] === '@') {
                  index = i;
                  break;
               }
            }
            if (index === undefined && s.length) {
               index = 0;
            }
         }
         return index === undefined ? undefined : s[index].n;
      }
   });

   Sbis.FIELD_TYPE = FIELD_TYPE;

   Di.register('adapter.sbis', Sbis);

   return Sbis;
});
