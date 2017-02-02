/**
 * Created by am.gerasimov on 28.09.2016.
 */
/*global $ws, define*/
define('js!SBIS3.CONTROLS.Demo.DemoDataGridSelector',
   [
      'js!SBIS3.CONTROLS.SelectorController',
      'html!SBIS3.CONTROLS.Demo.DemoDataGridSelector',
      'js!WS.Data/Source/Memory',
      'js!SBIS3.CONTROLS.SelectorWrapper',
      'js!SBIS3.CONTROLS.TreeDataGridView',
      'js!SBIS3.CONTROLS.Button'
   ],
   function (SelectorController, dotTplFn, Memory) {
      'use strict';

      var DemoDataGridSelector = SelectorController.extend({
         _dotTplFn: dotTplFn,
         $protected: {
         },

         $constructor: function () {},

         init: function() {
            DemoDataGridSelector.superclass.init.apply(this, arguments);

            var memorySource = new Memory({
               data: [
                  {Имя: 'Иван', Фамилия: 'Иванов', 'Раздел@': true},
                  {Имя: 'Дмитрий', Фамилия: 'Новиков', 'Раздел@': true},
                  {Имя: 'Дмитрий', Фамилия: 'Крайнов', 'Раздел@': true},
                  {Имя: 'Александр', Фамилия: 'Герасимов', 'Раздел@': true},
                  {Имя: 'Алексей', Фамилия: 'Авраменко', 'Раздел@': null},
                  {Имя: 'Андрей', Фамилия: 'Красильников', 'Раздел@': null},
                  {Имя: 'Андрей', Фамилия: 'Бегунов', 'Раздел@': null},
                  {Имя: 'Андрей', Фамилия: 'Сухоручкин', 'Раздел@': null},
                  {Имя: 'Андрей', Фамилия: 'Шипин', 'Раздел@': null}
               ],
               idProperty: 'Фамилия'
            });

            var dataGrid = this.getChildControlByName('DataGrid');
            dataGrid.setDataSource(memorySource);
         }
      });
      return DemoDataGridSelector;
   }
);