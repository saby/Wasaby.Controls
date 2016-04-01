/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSet', [
   'js!SBIS3.CONTROLS.Data.Adapter.Abstract',
   'js!SBIS3.CONTROLS.Data.Adapter.RecordSetTable',
   'js!SBIS3.CONTROLS.Data.Adapter.RecordSetRecord',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Abstract, RecordSetTable, RecordSetRecord, Utils, Di) {
   'use strict';

   /**
    * Адаптер для рекордсета
    * @class SBIS3.CONTROLS.Data.Adapter.RecordSet
    * @extends SBIS3.CONTROLS.Data.Adapter.Abstract
    * @public
    * @author Мальцев Алексей
    */

   var RecordSet = Abstract.extend(/** @lends SBIS3.CONTROLS.Data.Adapter.RecordSet.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Adapter.RecordSet',

      /**
       * Возвращает интерфейс доступа к рекордсету в виде таблицы
       * @param {SBIS3.CONTROLS.Data.Collection.RecordSet} data Рекордсет
       * @returns {SBIS3.CONTROLS.Data.Adapter.ITable}
       */
      forTable: function (data) {
         return new RecordSetTable(data);
      },

      /**
       * Возвращает интерфейс доступа к record-у в виде записи
       * @param {SBIS3.CONTROLS.Data.Record} data Запись
       * @returns {SBIS3.CONTROLS.Data.Adapter.IRecord}
       */
      forRecord: function (data) {
         return new RecordSetRecord(data);
      },

      getProperty: function (data, property) {
         return Utils.getItemPropertyValue(data, property);
      },

      setProperty: function (data, property, value) {
         return Utils.setItemPropertyValue(data, property, value);
      },

      getKeyField: function (data) {
         if (data) {
            if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet') ||
               $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Model')
            ) {
               return data.getIdProperty();
            }
         }
         return undefined;
      }
   });

   Di.register('adapter.recordset', RecordSet);

   return RecordSet;
});

