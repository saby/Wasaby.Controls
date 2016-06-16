/* global define */
define('js!SBIS3.CONTROLS.Data.ICloneable', ['js!WS.Data.Entity.ICloneable'], function (ICloneable) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.ICloneable', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.ICloneable instead');
   return ICloneable;
});
