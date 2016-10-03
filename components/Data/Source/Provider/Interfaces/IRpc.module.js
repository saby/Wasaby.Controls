/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IRpc', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/Provider/IRpc"
], function ( IoC, ConsoleLogger,IRpc) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.IRpc', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Provider/IRpc instead.');
   return IRpc;
});
