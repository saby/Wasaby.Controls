/* global define */
define('js!WS.Data/Adapter/RecordSet', [
   'js!WS.Data/Adapter/Abstract',
   'js!WS.Data/Adapter/RecordSetTable',
   'js!WS.Data/Adapter/RecordSetRecord',
   'js!WS.Data/Utils',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   Abstract,
   RecordSetTable,
   RecordSetRecord,
   Utils,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Адаптер для рекордсета.
    * Работает с данными, представленными в виде рекорда/рекордсета.
    * Примеры можно посмотреть в модулях {@link WS.Data/Adapter/RecordSetRecord} и {@link WS.Data/Adapter/RecordSetTable}.
    * @class WS.Data/Adapter/RecordSet
    * @extends WS.Data/Adapter/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var RecordSet = Abstract.extend(/** @lends WS.Data/Adapter/RecordSet.prototype */{
      _moduleName: 'WS.Data/Adapter/RecordSet',

      /**
       * Возвращает интерфейс доступа к рекордсету в виде таблицы
       * @param {WS.Data/Collection/RecordSet} data Рекордсет
       * @return {WS.Data/Adapter/ITable}
       */
      forTable: function (data) {
         return new RecordSetTable(data);
      },

      /**
       * Возвращает интерфейс доступа к record-у в виде записи
       * @param {WS.Data/Entity/Record} data Запись
       * @param {WS.Data/Collection/RecordSet} [tableData] Таблица
       * @return {WS.Data/Adapter/IRecord}
       */
      forRecord: function (data, tableData) {
         return new RecordSetRecord(data, tableData);
      },

      getProperty: function (data, property) {
         return Utils.getItemPropertyValue(data, property);
      },

      setProperty: function (data, property, value) {
         return Utils.setItemPropertyValue(data, property, value);
      },

      getKeyField: function (data) {
         if (data) {
            if (CoreInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet') ||
               CoreInstance.instanceOfModule(data, 'WS.Data/Entity/Model')
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

