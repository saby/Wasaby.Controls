/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.HierarchyField', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Format/HierarchyField"
], function ( IoC, ConsoleLogger,HierarchyField) {
   'use strict';
   IoC.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.HierarchyField', 'Module is no longer available since version 3.7.4.100. Use WS.Data/Format/HierarchyField instead.');
   return HierarchyField;
});
