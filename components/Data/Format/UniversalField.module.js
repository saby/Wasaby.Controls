/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.UniversalField', ['js!WS.Data.Format.UniversalField'], function (UniversalField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.UniversalField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.UniversalField instead');
   return UniversalField;
});
