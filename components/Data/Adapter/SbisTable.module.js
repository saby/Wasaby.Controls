/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisTable', ['js!WS.Data.Adapter.SbisTable'], function (SbisTable) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.SbisTable', 'Module has been renamed in 3.7.4.100. Use WS.Data.Adapter.SbisTable instead');
   return SbisTable;
});
