/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', ['js!WS.Data/Adapter/RecordSetRecord'], function (RecordSetRecord) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/RecordSetRecord instead.');
   return RecordSetRecord;
});
