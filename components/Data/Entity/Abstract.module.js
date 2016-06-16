/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.Abstract', ['js!WS.Data.Entity.Abstract'], function (Abstract) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Entity.Abstract', 'Module has been renamed in 3.7.4.100. Use WS.Data.Entity.Abstract instead');
   return Abstract;
});
