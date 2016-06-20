/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FieldsFactory', ['js!WS.Data.Format.FieldsFactory'], function (FieldsFactory) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.FieldsFactory', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Format.FieldsFactory instead.');
   return FieldsFactory;
});
