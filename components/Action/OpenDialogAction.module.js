define('js!SBIS3.CONTROLS.OpenDialogAction', [
   'js!SBIS3.CONTROLS.Action.OpenEditDialog',
   'Core/IoC'
], function (OpenEditDialog, IoC) {
   'use strict';
   IoC.resolve('ILogger').log('DialogActionBase', 'Компонент SBIS3.CONTROLS.OpenDialogAction является устаревшим используйте SBIS3.CONTROLS.Action.OpenEditDialog');
   return OpenEditDialog;
});