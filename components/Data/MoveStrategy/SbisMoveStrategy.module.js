define('js!SBIS3.CONTROLS.Data.SbisMoveStrategy', [
   'js!SBIS3.CONTROLS.Data.MoveStrategy.Sbis'
], function (Sbis) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('SbisMoveStrategy', 'Module SBIS3.CONTROLS.Data.SbisMoveStrategy was rename in 3.7.3.100. Please use SBIS3.CONTROLS.Data.MoveStrategy.Sbis.');
   return Sbis;
});
