/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisTable', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/SbisTable"
], function ( IoC, ConsoleLogger,SbisTable) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.SbisTable', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/SbisTable instead.');
   return SbisTable;
});
