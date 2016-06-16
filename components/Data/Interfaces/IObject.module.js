/* global define */
define('js!SBIS3.CONTROLS.Data.IObject', ['js!WS.Data.Entity.IObject'], function (IObject) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.IObject', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.IObject instead');
   return IObject;
});
