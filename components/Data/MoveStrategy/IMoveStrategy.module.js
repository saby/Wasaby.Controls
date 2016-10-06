/* global define */
define('js!SBIS3.CONTROLS.Data.MoveStrategy.IMoveStrategy', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/MoveStrategy/IMoveStrategy"
], function ( IoC, ConsoleLogger,IMoveStrategy) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.MoveStrategy.IMoveStrategy', 'Module is no longer available since version 3.7.4.100. Use WS.Data/MoveStrategy/IMoveStrategy instead.');
   return IMoveStrategy;
});
