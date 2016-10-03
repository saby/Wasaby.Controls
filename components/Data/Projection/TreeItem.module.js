/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeItem', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/TreeItem"
], function ( IoC, ConsoleLogger,TreeItem) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.TreeItem', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/TreeItem instead.');
   return TreeItem;
});
