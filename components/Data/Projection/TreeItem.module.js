/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeItem', ['js!WS.Data.Display.TreeItem'], function (TreeItem) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.TreeItem', 'Module has been renamed in 3.7.4.100. Use WS.Data.Display.TreeItem instead');
   return TreeItem;
});
