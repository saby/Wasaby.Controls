/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonTable', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/JsonTable"
], function ( IoC, ConsoleLogger,JsonTable) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.JsonTable', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/JsonTable instead.');
   return JsonTable;
});
