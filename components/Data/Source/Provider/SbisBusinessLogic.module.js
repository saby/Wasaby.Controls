/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/Provider/SbisBusinessLogic"
], function ( IoC, ConsoleLogger,SbisBusinessLogic) {
    'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Provider/SbisBusinessLogic instead.');
   return SbisBusinessLogic;
});
