/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DateField', ['js!WS.Data.Format.DateField'], function (DateField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.DateField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.DateField instead');
   return DateField;
});
