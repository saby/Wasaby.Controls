/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Base', ['js!WS.Data.Source.Base'], function (Base) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Base', 'Module has been renamed in 3.7.4.100. Use WS.Data.Source.Base instead');
   return Base;
});
