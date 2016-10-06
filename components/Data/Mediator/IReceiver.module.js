/* global define */
define('js!SBIS3.CONTROLS.Data.Mediator.IReceiver', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Mediator/IReceiver"
], function ( IoC, ConsoleLogger,IReceiver) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Mediator.IReceiver', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Mediator/IReceiver instead.');
   return IReceiver;
});
