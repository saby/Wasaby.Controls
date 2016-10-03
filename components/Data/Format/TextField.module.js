/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.TextField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/TextField"
], function ( IoC, ConsoleLogger,TextField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.TextField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/TextField instead.');
   return TextField;
});
