/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Record', ['js!WS.Data.Entity.Record'], function (Record) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Record', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.Record instead');
   return Record;
});
