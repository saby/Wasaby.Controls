/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Dictionary', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Types/Dictionary"
], function ( IoC, ConsoleLogger,Dictionary) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.Dictionary', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Types/Dictionary instead.');
   return Dictionary;
});
