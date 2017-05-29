/* global define */
define('js!WS.Data/Source/Rpc', [
   'js!WS.Data/Source/Remote',
   'js!WS.Data/Utils',
   'Core/core-instance'
], function (
   Remote,
   Utils,
   CoreInstance
) {
   'use strict';

   /**
    * Источник данных, работающий по технологии RPC.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Source/Rpc
    * @extends WS.Data/Source/Remote
    * @public
    * @author Мальцев Алексей
    */

   var Rpc = Remote.extend(/** @lends WS.Data/Source/Rpc.prototype */{
      _moduleName: 'WS.Data/Source/Rpc',

      /**
       * @cfg {String|Function|WS.Data/Source/Provider/IRpc} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @name WS.Data/Source/Rpc#provider
       * @see getProvider
       * @see WS.Data/Di
       * @example
       * <pre>
       *    var dataSource = new RpcSource({
       *       endpoint: 'Users',
       *       provider: 'source.provider.json-rpc'
       *    });
       * </pre>
       * @example
       * <pre>
       *    var dataSource = new RpcSource({
       *       endpoint: 'Users'
       *       provider: new JsonRpcProvider()
       *    });
       * </pre>
       */

      //region WS.Data/Source/Remote

      /**
       * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @return {WS.Data/Source/Provider/IRpc}
       * @see provider
       */
      getProvider: function () {
         var provider = Rpc.superclass.getProvider.call(this);

         if (!provider || !CoreInstance.instanceOfMixin(provider, 'WS.Data/Source/Provider/IRpc')) {
            throw new Error('Provider should implement WS.Data/Source/Provider/IRpc');
         }

         return provider;
      }

      //endregion WS.Data/Source/Remote

      //region Public methods

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   return Rpc;
});
