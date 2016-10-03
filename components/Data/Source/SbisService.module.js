/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.SbisService', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/SbisService"
], function ( IoC, ConsoleLogger,SbisService) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.SbisService', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/SbisService instead.');
   return SbisService;
});
