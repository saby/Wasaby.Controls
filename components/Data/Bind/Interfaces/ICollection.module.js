/* global define */
define('js!SBIS3.CONTROLS.Data.Bind.ICollection', ['js!WS.Data.Collection.IBind'], function (IBind) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Bind.ICollection', 'Module has been renamed in 3.7.4.100. Use WS.Data.Collection.IBind instead');
   return IBind;
});
