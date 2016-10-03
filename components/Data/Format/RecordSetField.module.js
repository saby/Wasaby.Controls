/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RecordSetField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/RecordSetField"
], function ( IoC, ConsoleLogger,RecordSetField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.RecordSetField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/RecordSetField instead.');
   return RecordSetField;
});
