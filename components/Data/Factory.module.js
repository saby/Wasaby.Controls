/*global $ws, define*/
define('js!SBIS3.CONTROLS.Data.Factory', ['js!WS.Data/Factory'], function (Factory) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Factory', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Factory instead.');
   return Factory;
});
