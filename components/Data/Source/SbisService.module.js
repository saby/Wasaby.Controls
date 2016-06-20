/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.SbisService', ['js!WS.Data.Source.SbisService'], function (SbisService) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Source.SbisService', 'Module is no longer available since version 3.7.4.100. Use WS.Data.Source.SbisService instead.');
   return SbisService;
});
