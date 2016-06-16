/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RecordField', ['js!WS.Data.Format.RecordField'], function (RecordField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.RecordField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.RecordField instead');
   return RecordField;
});
