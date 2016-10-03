/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Base', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/Base"
], function ( IoC, ConsoleLogger,Base) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Base', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Base instead.');
   return Base;
});
