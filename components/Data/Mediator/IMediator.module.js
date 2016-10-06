/* global define */
define('js!SBIS3.CONTROLS.Data.Mediator.IMediator', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Mediator/IMediator"
], function ( IoC, ConsoleLogger,IMediator) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Mediator.IMediator', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Mediator/IMediator instead.');
   return IMediator;
});
