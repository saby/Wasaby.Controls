/* global define */
define('js!WS.Data/Mediator/IReceiver', [], function () {
   'use strict';

   /**
    * Интерфейс сущности, взаимодействующей с посредником
    * @interface WS.Data/Mediator/IReceiver
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Mediator/IReceiver.prototype */{
      _wsDataMediatorIReceiver: true,

      /**
       * Принимает уведомление от посредника об изменении отношений
       * @param {Object} which Объект, уведомивший об изменении отношений
       * @param {String} [name] Название отношений
       * @param {*} [data] Данные о состоянии отношений
       */
      relationChanged: function (which, name, data) {
         throw new Error('Method must be implemented');
      }
   };
});
