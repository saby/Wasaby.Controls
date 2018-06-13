define('Controls-demo/Popup/TestFormController/FormController', [
   'SBIS3.CONTROLS/FormController',
   'html!Controls-demo/Popup/TestFormController/FormController',
   'WS.Data/Entity/Model',
   'SBIS3.CONTROLS/TextBox',
   'SBIS3.CONTROLS/NumberTextBox',
   'SBIS3.CONTROLS/Button',
   'css!Controls-demo/Popup/TestFormController/FormController',
   'SBIS3.CONTROLS/FieldLink',
   'SBIS3.CONTROLS/DataGridView'
], function(
   FormController,
   dotTplFn
){
   var
      moduleClass = FormController.extend({
         _dotTplFn: dotTplFn,

         init: function() {
            moduleClass.superclass.init.call(this);

            this.getChildControlByName('Сохранить').subscribe('onActivated', function() {
               answer = this.sendCommand('update', {closePanelAfterSubmit: true, hideErrorDialog: true});
            });
         }
      });

   moduleClass.dimensions = {
      minWidth: 500,
      maxWidth: 500,
      title: 'Редактирование записи',
      resizable: false
   };

   return moduleClass;
}
);
