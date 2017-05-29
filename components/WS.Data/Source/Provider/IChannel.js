/* global define */
define('js!WS.Data/Source/Provider/IChannel', [], function () {
   'use strict';

   /**
    * Интерфейс канала серверных событий
    * @interface WS.Data/Source/Provider/IChannel
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends WS.Data/Source/Provider/IChannel.prototype */{
      /**
       * @event onMessage При получении уведомления о серверном событии
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String|Object} message Сообщение события.
       */
   };
});
