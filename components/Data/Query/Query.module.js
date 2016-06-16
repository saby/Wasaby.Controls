/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.Query', ['js!WS.Data.Query.Query'], function (Query) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Query.Query', 'Module has been renamed in 3.7.4.100. Use WS.Data.Query.Query instead');
   return Query;
});
