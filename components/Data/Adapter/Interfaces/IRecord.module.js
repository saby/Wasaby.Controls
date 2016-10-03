/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.IRecord', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/IRecord"
], function ( IoC, ConsoleLogger,IRecord) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.IRecord', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/IRecord instead.');
   return IRecord;
});
