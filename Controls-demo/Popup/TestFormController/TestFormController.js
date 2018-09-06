/**
 * @author Митин А.Ю.
 */
define('Controls-demo/Popup/TestFormController/TestFormController', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/TestFormController/TestFormController',
   'WS.Data/Source/Memory',
   'Controls-demo/Popup/TestFormController/FormController'
], function(CompoundControl, dotTplFn, Memory) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      init: function() {
         moduleClass.superclass.init.call(this);

         var
            myDialogAction_1 = this.getChildControlByName('tplIntFCDialog_1'),
            ListView1 = this.getChildControlByName('ListView1');

         myDialogAction_1.setLinkedObject(ListView1);

         ListView1.subscribe('onItemClick', function(event, id, data) {
            myDialogAction_1.execute({
               initializingWay: 'local',
               item: data,
               mode: 'floatArea',
               source: new Memory({
                  data: ListView1._options.items, // Передаём в качестве данных созданный массив
                  idProperty: 'key' // Устанавливаем поле первичного ключа
               }),
               template: 'Controls-demo/Popup/TestFormController/FormController',
               dialogOptions: {
                  title: "Редактирование записи",
                  autoHide: false,
                  isStack: true
               }
            });
         });
      },

   });

   moduleClass.dimensions = {
      minWidth: 500,
      maxWidth: 500
   };

   return moduleClass;
});