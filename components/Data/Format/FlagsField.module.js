/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FlagsField', ['js!WS.Data.Format.FlagsField'], function (FlagsField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.FlagsField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.FlagsField instead');
   return FlagsField;
});
