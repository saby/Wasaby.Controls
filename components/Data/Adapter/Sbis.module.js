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
      }
   });

   Sbis.FIELD_TYPE = FIELD_TYPE;

   Di.register('adapter.sbis', Sbis);

   return Sbis;
});
