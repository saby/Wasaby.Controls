/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.Order', ['js!WS.Data.Query.Order'], function (Order) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Query.Order', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Query.Order instead.');
   return Order;
});
