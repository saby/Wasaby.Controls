/* global define */
define('js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection', ['js!WS.Data.Display.IBindCollection'], function (IBindCollection) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Bind.ICollectionProjection', 'Module has been renamed in 3.7.4.100. Use WS.Data.Display.IBindCollection instead');
   return IBindCollection;
});
