/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.ArrayStrategy', ['js!SBIS3.CONTROLS.Data.Adapter.Json'], function (AdapterJson) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').log('ArrayStrategy', 'С 3.7.3.20 класс SBIS3.CONTROLS.ArrayStrategy устарел, используйте SBIS3.CONTROLS.Data.Adapter.Json');
   return AdapterJson;
});