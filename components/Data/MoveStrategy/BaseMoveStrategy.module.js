define('js!SBIS3.CONTROLS.Data.BaseMoveStrategy', [
   'js!SBIS3.CONTROLS.Data.MoveStrategy.Base'
], function (Base) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').error('BaseMoveStrategy', 'Module SBIS3.CONTROLS.Data.SbisMoveStrategy was renaim in 3.7.3.100. Please use SBIS3.CONTROLS.Data.MoveStrategy.Sbis.');
   return Base;
});
