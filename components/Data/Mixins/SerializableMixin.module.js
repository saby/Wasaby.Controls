/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.SerializableMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/SerializableMixin"
], function ( IoC, ConsoleLogger,SerializableMixin) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.SerializableMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/SerializableMixin instead.');
   return SerializableMixin;
});
