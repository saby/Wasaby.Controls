/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Rpc', ['js!WS.Data.Source.Rpc'], function (Rpc) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Rpc', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Source.Rpc instead.');
   return Rpc;
});
