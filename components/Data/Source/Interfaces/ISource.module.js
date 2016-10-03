/* global define */
define('js!SBIS3.CONTROLS.Data.Source.ISource', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/ISource"
], function ( IoC, ConsoleLogger,ISource) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.ISource', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/ISource instead.');
   return ISource;
});
