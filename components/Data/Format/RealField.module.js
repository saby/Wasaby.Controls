/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RealField', ['js!WS.Data.Format.RealField'], function (RealField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.RealField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.RealField instead');
   return RealField;
});
