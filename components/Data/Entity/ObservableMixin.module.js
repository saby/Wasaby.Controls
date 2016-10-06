/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.ObservableMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/ObservableMixin"
], function ( IoC, ConsoleLogger,ObservableMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Entity.ObservableMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/ObservableMixin instead.');
   return ObservableMixin;
});
