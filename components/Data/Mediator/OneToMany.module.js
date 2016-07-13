/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Mediator.OneToMany', ['js!WS.Data/Mediator/OneToMany'], function (OneToMany) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Mediator.OneToMany', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Mediator/OneToMany instead.');
   return OneToMany;
});
