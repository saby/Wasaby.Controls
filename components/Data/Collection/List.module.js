/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.List', ['js!WS.Data.Collection.List'], function (List) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.List', 'Module has been renamed in 3.7.4.100. Use WS.Data.Collection.List instead');
   return List;
});
