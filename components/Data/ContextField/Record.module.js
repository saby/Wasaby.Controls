/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Record', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/ContextField/Record"
], function ( IoC, ConsoleLogger,Record) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.Record', 'Module is no longer available since version 3.7.4.100. Use WS.Data/ContextField/Record instead.');
   return Record;
});
