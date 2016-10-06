/* global define */
define('js!SBIS3.CONTROLS.Data.ICloneable', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Entity/ICloneable"
], function ( IoC, ConsoleLogger,ICloneable) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.ICloneable', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Entity/ICloneable instead.');
   return ICloneable;
});
