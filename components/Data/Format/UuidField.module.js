/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.UuidField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/UuidField"
], function ( IoC, ConsoleLogger,UuidField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.UuidField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/UuidField instead.');
   return UuidField;
});
