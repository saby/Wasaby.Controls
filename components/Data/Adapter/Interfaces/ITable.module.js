/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.ITable', ['js!WS.Data.Adapter.ITable'], function (ITable) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.ITable', 'Module has been renamed in 3.7.4.100. Use WS.Data.Adapter.ITable instead');
   return ITable;
});
