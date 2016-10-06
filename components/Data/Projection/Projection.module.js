/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Projection', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/Display"
], function ( IoC, ConsoleLogger,Projection) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.Projection', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/Display instead.');
   return Projection;
});
