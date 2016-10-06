/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.IdentityField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/IdentityField"
], function ( IoC, ConsoleLogger,IdentityField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.IdentityField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/IdentityField instead.');
   return IdentityField;
});
