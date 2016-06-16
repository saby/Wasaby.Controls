/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Record', ['js!WS.Data.ContextField.Record'], function (Record) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.Record', 'Module has been renamed in 3.7.4.100. Use WS.Data.ContextField.Record instead');
   return Record;
});
