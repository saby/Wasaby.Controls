/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Adapter.RecordSet', ['js!WS.Data/Adapter/RecordSet'], function (RecordSet) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.RecordSet', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Adapter/RecordSet instead.');
   return RecordSet;
});
