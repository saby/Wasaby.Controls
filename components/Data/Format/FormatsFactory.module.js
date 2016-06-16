/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FormatsFactory', ['js!WS.Data.Format.FormatsFactory'], function (FormatsFactory) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.FormatsFactory', 'Module has been renamed in 3.7.4.100. Use WS.Data.Format.FormatsFactory instead');
   return FormatsFactory;
});
