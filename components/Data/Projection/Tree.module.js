/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Tree', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/Tree"
], function ( IoC, ConsoleLogger,Tree) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.Tree', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/Tree instead.');
   return Tree;
});
