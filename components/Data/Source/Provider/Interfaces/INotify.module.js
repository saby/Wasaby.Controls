/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.INotify', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/Provider/INotify"
], function ( IoC, ConsoleLogger,INotify) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.INotify', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Provider/INotify instead.');
   return INotify;
});
