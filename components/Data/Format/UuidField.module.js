/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.UuidField', ['js!WS.Data.Format.UuidField'], function (UuidField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.UuidField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.UuidField instead');
   return UuidField;
});
