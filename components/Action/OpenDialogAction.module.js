define('SBIS3.CONTROLS/Action/OpenDialogAction', [
   'SBIS3.CONTROLS/Action/List/OpenEditDialog',
   'Core/IoC'
], function (OpenEditDialog, IoC) {
   'use strict';
   IoC.resolve('ILogger').log('DialogActionBase', 'Компонент SBIS3.CONTROLS/Action/OpenDialogAction является устаревшим, используйте SBIS3.CONTROLS/Action/List/OpenEditDialog');
   return OpenEditDialog;
});