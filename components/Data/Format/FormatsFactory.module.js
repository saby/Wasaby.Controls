/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FormatsFactory', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/FormatsFactory"
], function ( IoC, ConsoleLogger,FormatsFactory) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.FormatsFactory', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/FormatsFactory instead.');
   return FormatsFactory;
});
