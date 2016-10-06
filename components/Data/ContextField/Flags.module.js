/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Flags', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/ContextField/Flags"
], function ( IoC, ConsoleLogger,Flags) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.Flags', 'Module is no longer available since version 3.7.4.100. Use WS.Data/ContextField/Flags instead.');
   return Flags;
});
