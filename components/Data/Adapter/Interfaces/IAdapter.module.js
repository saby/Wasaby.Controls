/* global define */
define('js!SBIS3.CONTROLS.Data.Adapter.IAdapter', ['js!WS.Data.Adapter.IAdapter'], function (IAdapter) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Adapter.IAdapter', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Adapter.IAdapter instead.');
   return IAdapter;
});
