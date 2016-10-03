/* global define */
define('js!SBIS3.CONTROLS.Data.OneToManyMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/OneToManyMixin"
], function ( IoC, ConsoleLogger,OneToManyMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.OneToManyMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/OneToManyMixin instead.');
   return OneToManyMixin;
});
