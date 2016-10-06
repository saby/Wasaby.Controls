/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.DictionaryField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/DictionaryField"
], function ( IoC, ConsoleLogger,DictionaryField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.DictionaryField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/DictionaryField instead.');
   return DictionaryField;
});
