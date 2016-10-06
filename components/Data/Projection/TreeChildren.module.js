/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeChildren', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/TreeChildren"
], function ( IoC, ConsoleLogger,TreeChildren) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.TreeChildren', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/TreeChildren instead.');
   return TreeChildren;
});
