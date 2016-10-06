/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Collection', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/Collection"
], function ( IoC, ConsoleLogger,Collection) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.Collection', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/Collection instead.');
   return Collection;
});
