/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RecordField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/RecordField"
], function ( IoC, ConsoleLogger,RecordField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.RecordField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/RecordField instead.');
   return RecordField;
});
