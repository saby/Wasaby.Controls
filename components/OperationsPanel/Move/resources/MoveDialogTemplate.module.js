/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Move/resources/MoveDialogTemplate', [
   'SBIS3.CONTROLS/Action/resources/SelectionDialog',
   'Core/IoC'
], function(SelectionDialog, IoC) {
   IoC.resolve('ILogger').info('MoveDialogTemplate', 'SBIS3.CONTROLS/OperationsPanel/Move/resources/MoveDialogTemplate устарел используйте SBIS3.CONTROLS/Action/resources/SelectionDialog');
   return SelectionDialog;
});