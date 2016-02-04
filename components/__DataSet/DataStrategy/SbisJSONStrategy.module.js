/**
 * Created by as.manuylov on 10.11.14
 */
define('js!SBIS3.CONTROLS.SbisJSONStrategy', [
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis'
], function (AdapterSbis) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SbisJSONStrategy', 'Module SBIS3.CONTROLS.SbisJSONStrategy has been removed in 3.7.3.100. Use SBIS3.CONTROLS.Data.Adapter.Sbis instead');
   return AdapterSbis;
});