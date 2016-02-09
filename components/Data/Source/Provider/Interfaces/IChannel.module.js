/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IChannel', [
], function () {
   'use strict';

   /**
    * Интерфейс канала серверных событий
    * @mixin SBIS3.CONTROLS.Data.Source.Provider.IChannel
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Source.Provider.IChannel.prototype */{
      /**
       * @event onMessage При получении уведомления о серверном событии
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String|Object} message Сообщение события.
       */
   };
});
