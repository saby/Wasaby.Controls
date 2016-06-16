/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.JsonRecord', ['js!WS.Data.Adapter.JsonRecord'], function (JsonRecord) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.JsonRecord', 'Module has been renamed in 3.7.4.100. Use WS.Data.Adapter.JsonRecord instead');
   return JsonRecord;
});
