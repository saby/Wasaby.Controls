/**
 * @author Быканов А.А.
 */
define('js!SBIS3.CONTROLS.Demo.SumAction',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.SumAction',
      'js!WS.Data/Source/SbisService',
      'js!SBIS3.CONTROLS.ComponentBinder',
      'js!SBIS3.CONTROLS.TreeDataGridView',
      'js!SBIS3.CONTROLS.OperationsPanelButton',
      'js!SBIS3.CONTROLS.OperationsPanel', // Подключаем панель действий
      'js!SBIS3.CONTROLS.Action.List.Sum' // Подключаем действие суммирования
   ], 
   function(CompoundControl, dotTplFn, SbisService, ComponentBinder){
      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $constructor: function() {
            $ws.single.CommandDispatcher.declareCommand(this, 'sumItems', this._sumItems); // Устанавливаем функцию, которая будет выполнена при отправке команды mergeItems
         },
         init: function() {
            moduleClass.superclass.init.call(this);
            var myPanelButton = this.getChildControlByName('myPanelButton'),
                myPanel = this.getChildControlByName('myPanel'),
                myView = this.getChildControlByName('myView'),
                componentBinder = new ComponentBinder({
                   view: myView,
                   operationPanel: myPanel
                }),
                sumAction = this.getChildControlByName('SumAction'),
                dataSource = new SbisService({
                   endpoint: 'Товар',
                   idProperty: '@Products'
                });
            componentBinder.bindOperationPanel(true);
            myView.setDataSource(dataSource);
            myPanelButton.setLinkedPanel(myPanel);
            
            sumAction.setLinkedObject(myView); // Связываем действие суммирование и список
            sumAction.setDataSource(dataSource); // Устанавливаем действию суммирования источник данных
         },
         _sumItems: function() { // Функция, которая выполняется при вызове команды sumItems
            this.getChildControlByName('SumAction').execute({});
         }
      });
   return moduleClass;
   }
);