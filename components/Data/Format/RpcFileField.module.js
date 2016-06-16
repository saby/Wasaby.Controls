/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.RpcFileField', ['js!WS.Data.Format.RpcFileField'], function (RpcFileField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.RpcFileField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.RpcFileField instead');
   return RpcFileField;
});
