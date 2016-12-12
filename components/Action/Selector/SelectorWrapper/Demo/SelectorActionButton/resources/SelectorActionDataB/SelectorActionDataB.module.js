/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.CONTROLS.Demo.SelectorActionDataB', 
   [
      'js!SBIS3.CONTROLS.SelectorController',
      'html!SBIS3.CONTROLS.Demo.SelectorActionDataB',
      'js!WS.Data/Source/Memory',
      'js!SBIS3.CONTROLS.SelectorWrapper',
      'js!SBIS3.CONTROLS.TreeDataGridView',
      'js!SBIS3.CONTROLS.Button', 
      'js!SBIS3.CONTROLS.DataGridView'
   ], 
   function(SelectorController, dotTplFn, Memory) {
       'use strict';
   
   var SelectorActionDataB = SelectorController.extend({
      _dotTplFn: dotTplFn,

      init: function() {
         SelectorActionDataB.superclass.init.apply(this, arguments);
         
         var memorySource = new Memory({
            data: [
               {'номер': 1, 'книга': 'Сергей Лукьяненко. Джамп'},
               {'номер': 2, 'книга': 'Сергей Волков. Стража последнего рубежа'},
               {'номер': 3, 'книга': 'Стивен Кинг. Мобильник'},
               {'номер': 4, 'книга': 'Андрей Белянин. Меч без имени'},
               {'номер': 5, 'книга': 'Сергей Лукьяненко. Спектр'},
               {'номер': 6, 'книга': 'Джордж Мартин. Песнь льда и пламени'},
               {'номер': 7, 'книга': 'Евгений Гуляковский. Обратная сторона времени'},
               {'номер': 8, 'книга': 'Сергей Бадей. Свободный полет'},
               {'номер': 9, 'книга': 'Андрей Ливадный. Грань реальности'},
               {'номер': 10, 'книга': 'Джордж Оруэлл. 1984'},
               {'номер': 11, 'книга': 'Стивен Кинг. Лангольеры'},
               {'номер': 12, 'книга': 'Сергей Лукьяненко. Лабиринт отражений'}
            ],
            idProperty: 'номер'
         });

         var dataGrid = this.getChildControlByName('DataGrid');
         dataGrid.setDataSource(memorySource);

      }
   });
   

   return SelectorActionDataB;
});
