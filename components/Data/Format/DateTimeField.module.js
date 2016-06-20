/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DateTimeField', ['js!WS.Data.Format.DateTimeField'], function (DateTimeField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.DateTimeField', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Format.DateTimeField instead.');
   return DateTimeField;
});
