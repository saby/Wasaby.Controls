/* global define */
define('js!WS.Data/Source/Provider/INotify', [], function () {
   'use strict';

   /**
    * Интерфейс провайдера c доступом к серверным событиям
    * @interface WS.Data/Source/Provider/INotify
    * @public
    * @author Мальцев Алексей
    * @example
    * <pre>
    *    define(['Core/core-instance', 'Core/core-functions'], function(CoreInstance, CoreFunctions) {
    *       //...
    *       if (CoreInstance.instanceOfModule(dataSource, 'WS.Data/Source/Remote') {
    *          var provider = dataSource.getProvider();
    *          if (CoreInstance.instanceOfMixin(provider, 'WS.Data/Source/Provider/INotify') {
    *             provider.getEventsChannel().subscribe('onMessage', function(event, message) {
    *                CoreFunctions.alert('A message from the server: ' + message);
    *             });
    *          }
    *       }
    *    });
    * </pre>
    * @example
    * <pre>
    *    define(['Core/core-functions'], function(CoreFunctions) {
    *       //...
    *       dataSource.getProvider().getEventsChannel('ErrorLog').subscribe('onMessage', function(event, message) {
    *          CoreFunctions.alert('Something went wrong: ' + message);
    *       });
    *    });
    * </pre>
    */

   return /** @lends WS.Data/Source/Provider/INotify.prototype */{
      /**
       * Возвращает канал серверных событий
       * @param {String} [name] Имя канала событий
       * @return {WS.Data/Source/Provider/IChannel}
       */
      getEventsChannel: function (name) {
         throw new Error('Method must be implemented');
      }
   };
});
