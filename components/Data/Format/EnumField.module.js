/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.EnumField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/EnumField"
], function ( IoC, ConsoleLogger,EnumField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.EnumField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/EnumField instead.');
   return EnumField;
});
