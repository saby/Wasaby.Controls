/* global define, $ws  */
define('js!SBIS3.CONTROLS.Data.MoveStrategy.Base', ['js!WS.Data.MoveStrategy.Base'], function (Base) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.MoveStrategy.Base', 'Module has been renamed in 3.7.4.100. Use WS.Data.MoveStrategy.Base instead');
   return Base;
});
