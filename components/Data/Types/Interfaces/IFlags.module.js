/* global define */
define('js!SBIS3.CONTROLS.Data.Types.IFlags', ['js!WS.Data.Types.IFlags'], function (IFlags) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.IFlags', 'Module has been renamed in 3.7.4.100. Use WS.Data.Types.IFlags instead');
   return IFlags;
});
