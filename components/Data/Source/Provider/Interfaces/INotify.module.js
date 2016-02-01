/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.INotify', [
], function () {
   'use strict';

   /**
    * Интерфейс провайдера c доступом к серверным событиям
    * @mixin SBIS3.CONTROLS.Data.Source.Provider.INotify
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Source.Provider.INotify.prototype */{

      /**
       * @event onMessage При получении уведомления о серверном событии
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String|Object} message Сообщение события.
       * @example
       * <pre>
       *    var provider = dataSource.getProvider();
       *    if ($ws.helpers.instanceOfMixin(provider, 'SBIS3.CONTROLS.Data.Source.Provider.INotify') {
       *       provider.subscribe('onMessage', function(event, message) {
       *          $ws.helpers.alert('A message from the server: ' + message);
       *       });
       *    }
       * </pre>
       */

      $protected: {
         _options: {
            /**
             * @cfg {String} Название канала событий
             * @see getEventsChannel
             */
            eventsChannel: ''
         }
      },

      /**
       * Возвращает название канала событий
       * @returns {String}
       * @see eventsChannel
       */
      getEventsChannel: function () {
         throw new Error('Method must be implemented');
      }
   };
});
