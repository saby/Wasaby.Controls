/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FlagsField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/FlagsField"
], function ( IoC, ConsoleLogger,FlagsField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.FlagsField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/FlagsField instead.');
   return FlagsField;
});
