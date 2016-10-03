/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.OptionsMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/OptionsMixin"
], function ( IoC, ConsoleLogger,OptionsMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Entity.OptionsMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/OptionsMixin instead.');
   return OptionsMixin;
});
