/* global define, $ws  */
define('js!SBIS3.CONTROLS.Data.MoveStrategy.Base', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/MoveStrategy/Base"
], function ( IoC, ConsoleLogger,Base) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.MoveStrategy.Base', 'Module is no longer available since version 3.7.4.100. Use WS.Data/MoveStrategy/Base instead.');
   return Base;
});
