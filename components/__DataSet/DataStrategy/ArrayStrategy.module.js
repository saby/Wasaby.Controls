/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.ArrayStrategy', ['js!SBIS3.CONTROLS.Data.Adapter.Json'], function (AdapterJson) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('ArrayStrategy', 'Module SBIS3.CONTROLS.ArrayStrategy has been removed in 3.7.3.100. Use SBIS3.CONTROLS.Data.Adapter.Json instead');
   return AdapterJson;
});