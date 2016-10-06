/* global define */
define('js!SBIS3.CONTROLS.Data.IObject', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/IObject"
], function ( IoC, ConsoleLogger,IObject) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.IObject', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/IObject instead.');
   return IObject;
});
