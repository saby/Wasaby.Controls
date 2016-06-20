/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.RecordSet', ['js!WS.Data.Collection.RecordSet'], function (RecordSet) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Collection.RecordSet', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Collection.RecordSet instead.');
   return RecordSet;
});
