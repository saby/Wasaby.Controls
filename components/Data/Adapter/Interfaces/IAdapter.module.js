/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.IAdapter', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/IAdapter"
], function ( IoC, ConsoleLogger,IAdapter) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.IAdapter', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/IAdapter instead.');
   return IAdapter;
});
