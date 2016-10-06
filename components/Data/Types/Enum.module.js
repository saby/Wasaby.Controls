/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Enum', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Types/Enum"
], function ( IoC, ConsoleLogger,Enum) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.Enum', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Types/Enum instead.');
   return Enum;
});
