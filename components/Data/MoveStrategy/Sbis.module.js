/* global define, $ws*/
define('js!SBIS3.CONTROLS.Data.MoveStrategy.Sbis', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/MoveStrategy/Sbis"
], function ( IoC, ConsoleLogger,Sbis) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.MoveStrategy.Sbis', 'Module is no longer available since version 3.7.4.100. Use WS.Data/MoveStrategy/Sbis instead.');
   return Sbis;
});
