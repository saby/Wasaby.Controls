/* global define */
define('js!SBIS3.CONTROLS.Data.Types.IEnum', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Types/IEnum"
], function ( IoC, ConsoleLogger,IEnum) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Types.IEnum', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Types/IEnum instead.');
   return IEnum;
});
