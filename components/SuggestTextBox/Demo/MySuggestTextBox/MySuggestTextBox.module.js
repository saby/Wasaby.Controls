define('js!SBIS3.CONTROLS.Demo.MySuggestTextBox', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'js!WS.Data/Source/Memory', 
   'css!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'js!SBIS3.CONTROLS.SuggestTextBox',
   'js!SBIS3.CONTROLS.Link'
], function (CompoundControl, dotTplFn, MemorySource) {
   /**
    * SBIS3.CONTROLS.Demo.MySuggestTextBox
    * @class SBIS3.CONTROLS.Demo.MySuggestTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySuggestTextBox.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         moduleClass.superclass.init.call(this);
         
         var myData = [
                   {'Ид': 0, 'Название': 'Инженер-программист', 'ТекущаяКатегория': '1-ая категория'},
                   {'Ид': 1, 'Название': 'Инженер-программист', 'ТекущаяКатегория': '2-ая категория'},
                   {'Ид': 2, 'Название': 'Инженер-программист', 'ТекущаяКатегория': '3-ая категория'},
                   {'Ид': 3, 'Название': 'Инженер-программист', 'ТекущаяКатегория': 'Стажер'},
                   {'Ид': 4, 'Название': 'Инженер-программист', 'ТекущаяКатегория': 'Ведущий'},
                   {'Ид': 5, 'Название': 'Инженер-программист', 'ТекущаяКатегория': 'Руководитель'}
                ],
            
            dataSource = new MemorySource({
               data: myData, 
               idProperty: 'Ид'
            });

         var suggestOne = this.getChildControlByName('simpleSuggest');
         var suggestShowAll = this.getChildControlByName('simpleSuggestShowAll');


         suggestOne.subscribe('onListReady', function(event, list) {
            list.setDataSource(dataSource, true);
         });
         suggestShowAll.subscribe('onListReady', function(event, list) {
            list.setDataSource(dataSource, true);
         });
         

      }
   });
   
   return moduleClass;
});
