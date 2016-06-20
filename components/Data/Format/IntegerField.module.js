/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.IntegerField', ['js!WS.Data.Format.IntegerField'], function (IntegerField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.IntegerField', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Format.IntegerField instead.');
   return IntegerField;
});
