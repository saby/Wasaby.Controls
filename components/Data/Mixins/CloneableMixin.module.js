/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.CloneableMixin', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/CloneableMixin"
], function ( IoC, ConsoleLogger,CloneableMixin) {
   'use strict';
IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.CloneableMixin', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/CloneableMixin instead.');
return CloneableMixin;
});
