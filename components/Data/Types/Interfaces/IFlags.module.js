/* global define */
define('js!SBIS3.CONTROLS.Data.Types.IFlags', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Types/IFlags"
], function ( IoC, ConsoleLogger,IFlags) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.IFlags', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Types/IFlags instead.');
   return IFlags;
});
