/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.MoneyField', ['js!WS.Data.Format.MoneyField'], function (MoneyField) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Format.MoneyField', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Format.MoneyField instead.');
   return MoneyField;
});
