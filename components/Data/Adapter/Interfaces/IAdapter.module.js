/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.IAdapter', [], function () {
   'use strict';

   /**
    * Интерфейс адаптера, осуществляющиего операции с "сырыми" данными
    * @mixin SBIS3.CONTROLS.Data.Storage.IAdapter
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Adapter.IAdapter.prototype */{
      /**
       * Возвращает интерфейс доступа к данным в виде таблицы
       * @returns {SBIS3.CONTROLS.Data.Adapter.ITable}
       */
      forTable: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает интерфейс доступа к данным в виде записи
       * @returns {SBIS3.CONTROLS.Data.Adapter.IRecord}
       */
      forRecord: function () {
         throw new Error('Method must be implemented');
      }
   };
});
