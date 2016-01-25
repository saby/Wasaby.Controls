define('js!SBIS3.CONTROLS.Demo.FilterButtonHistoryMain', [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.FilterButton',
      'html!SBIS3.CONTROLS.Demo.FilterButtonMain',
      'js!SBIS3.CONTROLS.FilterHistoryController',
      'js!SBIS3.CONTROLS.DataGridView',
      'css!SBIS3.CONTROLS.Demo.FilterButtonMain',
      'js!SBIS3.CONTROLS.Demo.FilterButtonFilterContent',
      'js!SBIS3.CONTROLS.Demo.FilterButtonMocks'
   ],
   function(CompoundControl, FilterButton, MainTpl, FilterHistoryController) {
      var Main = CompoundControl.extend({
         _dotTplFn: MainTpl,

         $constructor: function() {
            var context = this.getLinkedContext();

            context.subscribe('onFieldsChanged', function() {
               var
                  filter = this.getValue('filter'),
                  filterDescr = this.getValue('filterDescr');

               this.setValueSelf('filterJSON', JSON.stringify(filter));
               this.setValueSelf('filterDescrJSON', JSON.stringify(filterDescr));
            });

            context.setValueSelf({
               filter: {
               },
               filterDescr: {
                  NDS: 'Не выбрано'
               }
            });
         },

         init: function() {
            Main.superclass.init.apply(this, arguments);
            var a = new FilterHistoryController({
               historyId: '123',
               filterButton: this.getChildControlByName('filterButton'),
               view: this.getChildControlByName('MyDataGrid')
            });
            this.getChildControlByName('filterButton').setHistoryController(a);
         }
      });

      return Main;
   }
);