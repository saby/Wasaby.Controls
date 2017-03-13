/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialogTemplate', [
   'js!SBIS3.CONTROLS.DefaultDialogForSelect',
   'Core/IoC'
], function(DefaultDialogForSelect, IoC) {
   IoC.resolve('ILogger').error('MoveDialogTemplate', 'SBIS3.CONTROLS.MoveDialogTemplate устарел используйте SBIS3.CONTROLS.DefaultDialogForSelect');
   return DefaultDialogForSelect;
});