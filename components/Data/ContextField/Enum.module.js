/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.Enum', ['js!WS.Data.ContextField.Enum'], function (Enum) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.Enum', 'Module has been renamed in 3.7.4.100. Use WS.Data.ContextField.Enum instead');
   return Enum;
});
