/* global define */
define('js!SBIS3.CONTROLS.Data.Mediator.IReceiver', ['js!WS.Data.Mediator.IReceiver'], function (IReceiver) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Mediator.IReceiver', 'Module has been renamed in 3.7.4.100. Use WS.Data.Mediator.IReceiver instead');
   return IReceiver;
});
