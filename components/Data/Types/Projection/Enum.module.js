/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Enum', ['js!WS.Data.Display.Enum'], function (Enum) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.Enum', 'Module has been renamed in 3.7.4.100. Use WS.Data.Display.Enum instead');
   return Enum;
});
