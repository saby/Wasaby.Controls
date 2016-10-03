/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Adapter/GenericFormatMixin"
], function ( IoC, ConsoleLogger,GenericFormatMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.GenericFormatMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/GenericFormatMixin instead.');
   return GenericFormatMixin;
});
