/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Collection', ['js!WS.Data.Display.Collection'], function (Collection) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.Collection', 'Module has been renamed in 3.7.4.100. Use WS.Data.Display.Collection instead');
   return Collection;
});
