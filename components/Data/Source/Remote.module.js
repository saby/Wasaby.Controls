/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Remote', ['js!WS.Data.Source.Remote'], function (Remote) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Remote', 'Module has been renamed in 3.7.4.100. Use WS.Data.Source.Remote instead');
   return Remote;
});
