/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.SbisServiceSource', [
   'js!SBIS3.CONTROLS.Data.Source.SbisService'
], function (SbisService) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SbisServiceSource', 'Module SBIS3.CONTROLS.SbisServiceSource has been removed in 3.7.3.100. Use SBIS3.CONTROLS.Data.Source.SbisService instead');
   return SbisService;
});