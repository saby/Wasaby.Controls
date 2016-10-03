/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.Format', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/Format"
], function ( IoC, ConsoleLogger,Format) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.Format', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/Format instead.');
   return Format;
});
