/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IAbstract', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/Provider/IAbstract"
], function ( IoC, ConsoleLogger,IAbstract) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.IAbstract', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Provider/IAbstract instead.');
   return IAbstract;
});
