/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.LoadableTreeItem', ['js!WS.Data.Display.LoadableTreeItem'], function (LoadableTreeItem) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.LoadableTreeItem', 'Module has been renamed in 3.7.4.100. Use WS.Data.Display.LoadableTreeItem instead');
   return LoadableTreeItem;
});
