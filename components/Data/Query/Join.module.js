/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.Join', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Query/Join"
], function ( IoC, ConsoleLogger,Join) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Query.Join', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Query/Join instead.');
   return Join;
});
