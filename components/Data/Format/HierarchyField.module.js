/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.HierarchyField', ['js!WS.Data.Format.HierarchyField'], function (HierarchyField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.HierarchyField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.HierarchyField instead');
   return HierarchyField;
});
