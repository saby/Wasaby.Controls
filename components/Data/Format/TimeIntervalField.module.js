/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.TimeIntervalField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/TimeIntervalField"
], function ( IoC, ConsoleLogger,TimeIntervalField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.TimeIntervalField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/TimeIntervalField instead.');
   return TimeIntervalField;
});
