/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.XmlField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/XmlField"
], function ( IoC, ConsoleLogger,XmlField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.XmlField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/XmlField instead.');
   return XmlField;
});
