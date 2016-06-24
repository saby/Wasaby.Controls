/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSetTable', ['js!WS.Data/Adapter/RecordSetTable'], function (RecordSetTable) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.RecordSetTable', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/RecordSetTable instead.');
   return RecordSetTable;
});
