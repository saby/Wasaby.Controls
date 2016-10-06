/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RealField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/RealField"
], function ( IoC, ConsoleLogger,RealField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.RealField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/RealField instead.');
   return RealField;
});
