/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Enum', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/ContextField/Enum"
], function ( IoC, ConsoleLogger,Enum) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.Enum', 'Module is no longer available since version 3.7.4.100. Use WS.Data/ContextField/Enum instead.');
   return Enum;
});
