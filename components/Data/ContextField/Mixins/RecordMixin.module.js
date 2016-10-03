/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.RecordMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/ContextField/RecordMixin"
], function ( IoC, ConsoleLogger,RecordMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.RecordMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/ContextField/RecordMixin instead.');
   return RecordMixin;
});
