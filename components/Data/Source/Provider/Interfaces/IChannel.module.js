/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.IChannel', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/Provider/IChannel"
], function ( IoC, ConsoleLogger,IChannel) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.Provider.IChannel', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Source/Provider/IChannel instead.');
   return IChannel;
});
