/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.Join', ['js!WS.Data/Query/Join'], function (Join) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Query.Join', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Query/Join instead.');
   return Join;
});
