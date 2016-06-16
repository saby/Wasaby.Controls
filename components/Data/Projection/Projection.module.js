/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Projection', ['js!WS.Data.Display.Projection'], function (Projection) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.Projection', 'Module has been renamed in 3.7.4.100. Use WS.Data.Display.Projection instead');
   return Projection;
});
