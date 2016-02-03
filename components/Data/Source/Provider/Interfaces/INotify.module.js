/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.INotify', [
], function () {
   'use strict';

   /**
    * Интерфейс провайдера c доступом к серверным событиям
    * @mixin SBIS3.CONTROLS.Data.Source.Provider.INotify
    * @public
    * @author Мальцев Алексей
    * @example
    * <pre>
    *    if ($ws.helpers.instanceOfModule(dataSource, 'SBIS3.CONTROLS.Data.Source.Remote') {
    *       var provider = dataSource.getProvider();
    *       if ($ws.helpers.instanceOfMixin(provider, 'SBIS3.CONTROLS.Data.Source.Provider.INotify') {
    *          provider.getChannel().subscribe('onMessage', function(event, message) {
    *             $ws.helpers.alert('A message from the server: ' + message);
    *          });
    *       }
    *    }
    * </pre>
    * @example
    * <pre>
    *    var provider = dataSource.getProvider();
    *    if ($ws.helpers.instanceOfMixin(provider, 'SBIS3.CONTROLS.Data.Source.Provider.INotify') {
       *       provider.getChannel('ErrorLog').subscribe('onMessage', function(event, message) {
       *          $ws.helpers.alert('Something went wrong: ' + message);
       *       });
       *    }
    * </pre>
    */

   return /** @lends SBIS3.CONTROLS.Data.Source.Provider.INotify.prototype */{
      /**
       * Возвращает канал серверных событий
       * @param {String} [name] Имя канала событий
       * @returns {SBIS3.CONTROLS.Data.Source.Provider.IChannel}
       */
      getEventsChannel: function (name) {
         throw new Error('Method must be implemented');
      }
   };
});
