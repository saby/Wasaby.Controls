/* global define */
define('js!SBIS3.CONTROLS.Data.Mediator.IMediator', ['js!WS.Data.Mediator.IMediator'], function (IMediator) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Mediator.IMediator', 'Module has been renamed in 3.7.4.100. Use WS.Data.Mediator.IMediator instead');
   return IMediator;
});
