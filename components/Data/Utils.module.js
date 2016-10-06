/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Utils', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Utils"
], function ( IoC, ConsoleLogger,Utils) {
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Utils', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Utils instead.');
   return Utils;
});
