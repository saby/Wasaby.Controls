/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Abstract', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/Abstract"
], function ( IoC, ConsoleLogger,Abstract) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.Abstract', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/Abstract instead.');
   return Abstract;
});
