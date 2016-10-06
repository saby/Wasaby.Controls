/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Di', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Di"
], function ( IoC, ConsoleLogger,Di) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Di', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Di instead.');
   return Di;
});
