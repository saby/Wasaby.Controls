/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.Json', ['js!WS.Data/Adapter/Json'], function (Json) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.Json', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/Json instead.');
   return Json;
});
