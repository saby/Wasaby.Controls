/* global define */
define('js!SBIS3.CONTROLS.Data.Mediator.IReceiver', [], function () {
   'use strict';

   /**
    * Интерфейс сущности, взаимодействующей с посредником
    * @mixin SBIS3.CONTROLS.Data.Mediator.IReceiver
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Mediator.IReceiver.prototype */{
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
