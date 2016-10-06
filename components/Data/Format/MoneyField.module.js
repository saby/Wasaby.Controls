/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.MoneyField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/MoneyField"
], function ( IoC, ConsoleLogger,MoneyField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.MoneyField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/MoneyField instead.');
   return MoneyField;
});
