/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.SbisRecord', ['js!WS.Data.Adapter.SbisRecord'], function (SbisRecord) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.SbisRecord', 'Module has been renamed in 3.7.4.100. Use WS.Data.Adapter.SbisRecord instead');
   return SbisRecord;
});
