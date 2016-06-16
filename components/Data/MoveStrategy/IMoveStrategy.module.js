/* global define */
define('js!SBIS3.CONTROLS.Data.MoveStrategy.IMoveStrategy', ['js!WS.Data.MoveStrategy.IMoveStrategy'], function (IMoveStrategy) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.MoveStrategy.IMoveStrategy', 'Module has been renamed in 3.7.4.100. Use WS.Data.MoveStrategy.IMoveStrategy instead');
   return IMoveStrategy;
});
