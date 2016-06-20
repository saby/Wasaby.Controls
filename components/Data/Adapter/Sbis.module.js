/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Sbis', ['js!WS.Data.Adapter.Sbis'], function (Sbis) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.Sbis', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Adapter.Sbis instead.');
   return Sbis;
});
