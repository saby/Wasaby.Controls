/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', ['js!WS.Data.Adapter.RecordSetRecord'], function (RecordSetRecord) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', 'Module has been renamed in 3.7.4.100. Use WS.Data.Adapter.RecordSetRecord instead');
   return RecordSetRecord;
});
