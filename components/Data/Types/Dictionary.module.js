/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Dictionary', ['js!WS.Data.Types.Dictionary'], function (Dictionary) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.Dictionary', 'Module has been renamed in 3.7.4.100. Use WS.Data.Types.Dictionary instead');
   return Dictionary;
});
