/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.SbisServiceSource', [
   'js!SBIS3.CONTROLS.Data.Source.SbisService'
], function (SbisService) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').log('SbisServiceSource', 'С 3.7.3.20 класс SBIS3.CONTROLS.SbisServiceSource устарел, используйте SBIS3.CONTROLS.Data.Source.SbisService');
   return SbisService
});