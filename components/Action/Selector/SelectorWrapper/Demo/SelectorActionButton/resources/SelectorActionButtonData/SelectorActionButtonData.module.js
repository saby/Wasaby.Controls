/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.CONTROLS.Demo.SelectorActionButtonData', 
   [
      'js!SBIS3.CONTROLS.SelectorController',
      'html!SBIS3.CONTROLS.Demo.SelectorActionButtonData',
      'js!WS.Data/Source/Memory',
      'js!SBIS3.CONTROLS.SelectorWrapper',
      'js!SBIS3.CONTROLS.TreeDataGridView',
      'js!SBIS3.CONTROLS.Button'
   ], 
   function(SelectorController, dotTplFn, Memory) {
       'use strict';
   
   var SelectorActionButtonData = SelectorController.extend({
      _dotTplFn: dotTplFn,
      $protected: {
      },
      $constructor: function() { },

      init: function() {
         SelectorActionButtonData.superclass.init.apply(this, arguments);
         
         var memorySource = new Memory({
            data: [
               {'номер': 1, 'книга': 'Сергей Лукьяненко', 'Раздел': null, 'Раздел@': true},
               {'номер': 1.0, 'книга': 'Джамп', 'Раздел': '1', 'Раздел@': null},
               {'номер': 1.1, 'книга': 'Рыцари сорока островов', 'Раздел': '1', 'Раздел@': null},
               {'номер': 1.3, 'книга': 'Лабиринт отражений', 'Раздел': '1', 'Раздел@': null},
               {'номер': 1.4, 'книга': 'Фальшивые зеркала', 'Раздел': '1', 'Раздел@': null},
               {'номер': 1.5, 'книга': 'Прозрачные витражи', 'Раздел': '1', 'Раздел@': null},
               {'номер': 1.6, 'книга': 'Спектр', 'Раздел': '1', 'Раздел@': null},
               {'номер': 2, 'книга': 'Аркадий и Борис Стругацкие', 'Раздел': null, 'Раздел@': true},
               {'номер': 2.0, 'книга': 'Жук в муравейнике', 'Раздел': '2', 'Раздел@': null},
               {'номер': 2.1, 'книга': 'Улитка на склоне', 'Раздел': '2', 'Раздел@': null},
               {'номер': 2.2, 'книга': 'Трудно быть богом', 'Раздел': '2', 'Раздел@': null},
               {'номер': 3, 'книга': 'Стивен Кинг', 'Раздел': null, 'Раздел@': true},
               {'номер': 3.0, 'книга': 'Лангольеры', 'Раздел': '3', 'Раздел@': null},
               {'номер': 3.1, 'книга': 'Мобильник', 'Раздел': '3', 'Раздел@': null},
               {'номер': 3.2, 'книга': 'Сияние', 'Раздел': '3', 'Раздел@': null},
               {'номер': 4, 'книга': 'Андрей Белянин.  Меч без имени', 'Раздел': null, 'Раздел@': null},
               {'номер': 5, 'книга': 'Джордж Мартин.  Песнь льда и пламени', 'Раздел': null, 'Раздел@': null},
               {'номер': 6, 'книга': 'Евгений Гуляковский.  Обратная сторона времени', 'Раздел': null, 'Раздел@': null},
               {'номер': 7, 'книга': 'Сергей Волков.  Стража последнего рубежа', 'Раздел': null, 'Раздел@': null},
               {'номер': 8, 'книга': 'Сергей Бадей.  Свободный полет', 'Раздел': null, 'Раздел@': null},
               {'номер': 9, 'книга': 'Андрей Ливадный.  Грань реальности', 'Раздел': null, 'Раздел@': null},
               {'номер': 10, 'книга': 'Джордж Оруэлл.  1984', 'Раздел': null, 'Раздел@': null}
            ],
            idProperty: 'номер'
         });

         var dataGrid = this.getChildControlByName('DataGrid');
         dataGrid.setDataSource(memorySource);


      }
   });

   return SelectorActionButtonData;
});

