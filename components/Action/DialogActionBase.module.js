define('js!SBIS3.CONTROLS.DialogActionBase', [
   "SBIS3.CONTROLS.Action.OpenDialog"
], function(OpenDialog){
   'use strict';
   IoC.resolve('ILogger').log('DialogActionBase', 'Компонент SBIS3.CONTROLS.DialogActionBase является устаревшим используйте SBIS3.CONTROLS.Action.OpenDialog');
   return OpenDialog;
});