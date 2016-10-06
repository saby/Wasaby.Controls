/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisRecord', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/SbisRecord"
], function ( IoC, ConsoleLogger,SbisRecord) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.SbisRecord', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/SbisRecord instead.');
   return SbisRecord;
});
