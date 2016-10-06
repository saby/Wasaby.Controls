/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DateTimeField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/DateTimeField"
], function ( IoC, ConsoleLogger,DateTimeField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.DateTimeField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/DateTimeField instead.');
   return DateTimeField;
});
