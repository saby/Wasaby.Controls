/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialogTemplate', [
   'js!SBIS3.CONTROLS.SelectionDialog',
   'Core/IoC'
], function(SelectionDialog, IoC) {
   IoC.resolve('ILogger').info('MoveDialogTemplate', 'SBIS3.CONTROLS.MoveDialogTemplate устарел используйте SBIS3.CONTROLS.SelectionDialog');
   return SelectionDialog;
});