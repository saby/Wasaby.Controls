/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.IdentityField', ['js!WS.Data.Format.IdentityField'], function (IdentityField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.IdentityField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.IdentityField instead');
   return IdentityField;
});
