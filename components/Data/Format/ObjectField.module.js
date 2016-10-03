/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.ObjectField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/ObjectField"
], function ( IoC, ConsoleLogger,ObjectField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.ObjectField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/ObjectField instead.');
   return ObjectField;
});
