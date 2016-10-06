/* global define */
define('js!SBIS3.CONTROLS.Data.Bind.ICollection', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/IBind"
], function ( IoC, ConsoleLogger,IBind) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Bind.ICollection', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Collection/IBind instead.');
   return IBind;
});
