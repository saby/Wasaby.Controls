/* global define */
define('js!WS.Data/Entity/IVersionable', [], function () {
   'use strict';

   /**
    * Интерфейс изменения версий объекта.
    * Позволяет быстро проверить изменилось ли что либо в объекте.
    * @interface WS.Data/Entity/IVersionable
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Entity/IVersionable.prototype */{
      _wsDataEntityIVersionable: true,

      /**
       * Возвращает версию объекта.
       * Версия соответсвует некому состоянию объекта и меняется при измении как то значимых свойств объекта,
       * например для рекорда это будет изменение полей.
       * @return {Number}
       * @example
       * Проверим изменился ли рекорд:
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var record = new Record({
       *             rawData: {
       *                id: 1
       *             }
       *          }),
       *          method = function (record) {
       *             if (Math.round(Math.random() * 1000) % 2 === 0) {
       *                record.set('id', 2);
       *             }
       *          };
       *
       *       version = record.getVersion();
       *       method(record);
       *       if (version != record.getVersion()) {
       *          CoreFunctions.alert('Изменился');
       *       }
       *    });
       * </pre>
       */
      getVersion: function () {
         throw new Error('Method must be implemented');
      }
   };
});
