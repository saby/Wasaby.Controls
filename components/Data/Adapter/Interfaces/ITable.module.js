/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.ITable', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/ITable"
], function ( IoC, ConsoleLogger,ITable) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.ITable', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/ITable instead.');
   return ITable;
});
