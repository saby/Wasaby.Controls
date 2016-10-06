/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Flags', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Types/Flags"
], function ( IoC, ConsoleLogger,Flags) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.Flags', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Types/Flags instead.');
   return Flags;
});
