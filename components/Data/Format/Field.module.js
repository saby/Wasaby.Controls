/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.Field', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/Field"
], function ( IoC, ConsoleLogger,Field) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.Field', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/Field instead.');
   return Field;
});
