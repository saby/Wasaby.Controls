/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Rpc', ['js!WS.Data.Source.Rpc'], function (Rpc) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Rpc', 'Module has been renamed in 3.7.4.100. Use WS.Data.Source.Rpc instead');
   return Rpc;
});
