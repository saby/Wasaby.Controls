/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ContextField.List', ['js!WS.Data.ContextField.List'], function (List) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.ContextField.List', 'Module has been renamed in 3.7.4.100. Use WS.Data.ContextField.List instead');
   return List;
});
