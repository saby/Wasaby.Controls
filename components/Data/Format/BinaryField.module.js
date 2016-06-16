/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.BinaryField', ['js!WS.Data.Format.BinaryField'], function (BinaryField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.BinaryField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.BinaryField instead');
   return BinaryField;
});
