/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.Abstract', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/Abstract"
], function ( IoC, ConsoleLogger,Abstract) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Entity.Abstract', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/Abstract instead.');
   return Abstract;
});
