/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.ObjectField', ['js!WS.Data.Format.ObjectField'], function (ObjectField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.ObjectField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.ObjectField instead');
   return ObjectField;
});
