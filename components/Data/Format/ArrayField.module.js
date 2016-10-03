/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.ArrayField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/ArrayField"
], function ( IoC, ConsoleLogger,ArrayField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.ArrayField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/ArrayField instead.');
   return ArrayField;
});
