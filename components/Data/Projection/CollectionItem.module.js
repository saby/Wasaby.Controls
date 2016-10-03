/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.CollectionItem', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/CollectionItem"
], function ( IoC, ConsoleLogger,CollectionItem) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.CollectionItem', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/CollectionItem instead.');
   return CollectionItem;
});
