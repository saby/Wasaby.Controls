/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.StringField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/StringField"
], function ( IoC, ConsoleLogger,StringField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.StringField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/StringField instead.');
   return StringField;
});
