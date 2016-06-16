/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RecordSetField', ['js!WS.Data.Format.RecordSetField'], function (RecordSetField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.RecordSetField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.RecordSetField instead');
   return RecordSetField;
});
