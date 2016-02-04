/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.StaticSource', [
   'js!SBIS3.CONTROLS.Data.Source.Memory'
], function (Memory) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('StaticSource', 'Module SBIS3.CONTROLS.StaticSource has been removed in 3.7.3.100. Use SBIS3.CONTROLS.Data.Source.Memory instead');
   return Memory;
});