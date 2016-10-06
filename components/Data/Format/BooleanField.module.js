/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.BooleanField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/BooleanField"
], function ( IoC, ConsoleLogger,BooleanField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.BooleanField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/BooleanField instead.');
   return BooleanField;
});
