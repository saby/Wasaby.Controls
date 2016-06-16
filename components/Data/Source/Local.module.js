/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Local', ['js!WS.Data.Source.Local'], function (Local) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Local', 'Module has been renamed in 3.7.4.100. Use WS.Data.Source.Local instead');
   return Local;
});
