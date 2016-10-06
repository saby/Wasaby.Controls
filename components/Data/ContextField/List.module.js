/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.List', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/ContextField/List"
], function ( IoC, ConsoleLogger,List) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.List', 'Module is no longer available since version 3.7.4.100. Use WS.Data/ContextField/List instead.');
   return List;
});
