/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.StringField', ['js!WS.Data.Format.StringField'], function (StringField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.StringField', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.StringField instead');
   return StringField;
});
