/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.BooleanField', ['js!WS.Data.Format.BooleanField'], function (BooleanField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.BooleanField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.BooleanField instead');
   return BooleanField;
});
