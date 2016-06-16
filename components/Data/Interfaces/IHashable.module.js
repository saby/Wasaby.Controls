/* global define */
define('js!SBIS3.CONTROLS.Data.IHashable', ['js!WS.Data.Entity.IHashable'], function (IHashable) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.IHashable', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.IHashable instead');
   return IHashable;
});
