/**
 * Created by as.manuylov on 10.11.14
 */
define('js!SBIS3.CONTROLS.SbisJSONStrategy', [
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis'
], function (AdapterSbis) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').log('SbisJSONStrategy', 'С 3.7.3.20 класс SBIS3.CONTROLS.SbisJSONStrategy устарел, используйте SBIS3.CONTROLS.Data.Adapter.Sbis');
   return AdapterSbis;
});