/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Enum', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Display/Enum"
], function ( IoC, ConsoleLogger,Enum) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.Enum', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Display/Enum instead.');
   return Enum;
});
