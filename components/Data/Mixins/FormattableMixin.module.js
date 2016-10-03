/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.FormattableMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/FormattableMixin"
], function ( IoC, ConsoleLogger,FormattableMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.FormattableMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/FormattableMixin instead.');
   return FormattableMixin;
});
