/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Enum', ['js!WS.Data.Types.Enum'], function (Enum) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.Enum', 'Module has been renamed in 3.7.4.100. Use WS.Data.Types.Enum instead');
   return Enum;
});
