/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.IntegerField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/IntegerField"
], function ( IoC, ConsoleLogger,IntegerField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.IntegerField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/IntegerField instead.');
   return IntegerField;
});
