/* global define */
define('js!SBIS3.CONTROLS.Data.IHashable', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/IHashable"
], function ( IoC, ConsoleLogger,IHashable) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.IHashable', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/IHashable instead.');
   return IHashable;
});
