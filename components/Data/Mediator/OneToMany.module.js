/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Mediator.OneToMany', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Mediator/OneToMany"
], function ( IoC, ConsoleLogger,OneToMany) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Mediator.OneToMany', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Mediator/OneToMany instead.');
   return OneToMany;
});
