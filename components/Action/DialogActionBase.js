define('SBIS3.CONTROLS/Action/DialogActionBase', [
   'SBIS3.CONTROLS/Action/OpenDialog',
   'Core/IoC'
], function(OpenDialog, IoC){
   'use strict';
   IoC.resolve('ILogger').log('DialogActionBase', 'Компонент SBIS3.CONTROLS/Action/DialogActionBase является устаревшим, используйте SBIS3.CONTROLS/Action/OpenDialog');
   return OpenDialog;
});