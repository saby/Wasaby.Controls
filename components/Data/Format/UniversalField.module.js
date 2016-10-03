/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.UniversalField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/UniversalField"
], function ( IoC, ConsoleLogger,UniversalField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.UniversalField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/UniversalField instead.');
   return UniversalField;
});
