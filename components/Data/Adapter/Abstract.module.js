/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Abstract', ['js!WS.Data.Adapter.Abstract'], function (Abstract) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.Abstract', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Adapter.Abstract instead.');
   return Abstract;
});
