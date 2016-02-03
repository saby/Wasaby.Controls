define('js!SBIS3.Engine.Demo.MyRightNavigationPanel', [
   'js!SBIS3.Engine.RightNavigationPanel',
   'html!SBIS3.Engine.Demo.MyRightNavigationPanel',
   'html!SBIS3.Engine.Demo.MyRightNavigationPanel/MyItemTpl',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy'
], function(RightNavigationPanel, DemoRightNavigationPanel, itemTpl,StaticSource,ArrayStrategy) {
   'use strict';
   var DemoRightNavigationPanel = RightNavigationPanel.extend({
      _dotTplFn: DemoRightNavigationPanel,
      $protected: {
         _options: {
            itemTemplate: itemTpl,
            hierField: 'parent',
            selectedKey: 4
         }
      },
      init: function() {
         DemoRightNavigationPanel.superclass.init.call(this);
         var items = [
            {'title': 'Общие сведения', 'id': 1, 'parent@': true},
            {'title': 'Личные данные', 'id': 2, 'parent@': false, 'parent': 1 },
            {'title': 'Поощрения и взыскания', counter: 1, icon: 'icon-16 icon-ThumbUp2 icon-done', 'id': 3, 'parent@': false},
            {'title': 'Рабочие зоны/группы', 'id': 4, 'parent@': false},
            {'title': 'Задачи', counter: '10', 'id': 5, 'parent@': true},
            {'title': 'Куда уходит время', 'id': 6, 'parent@': false, 'parent': 5 },
            {'title': 'Проекты', 'id': 7, 'parent@': true},
            {'title': 'Планы работ', 'id': 8, 'parent@': false, 'parent': 7 },
            {'title': 'Показатели KPI', 'id': 9, 'parent@': false},
            {'title': 'Зарплата и учет', counter: 0, 'id': 10, 'parent@': true},
            {'title': 'Отпуска и больничные', 'id': 11, 'parent@': false, 'parent': 10 },
            {'title': 'Вычеты и льготы', 'id': 12, 'parent@': false, 'parent': 10 },
            {'title': 'Сканы документов', 'id': 13, 'parent@': false, 'parent': 10 },
            {'title': 'Предыдущие места работы', 'id': 14, 'parent@': false, 'parent': 10 },
            {'title': 'Клиенты', 'id': 15, 'parent@': false},
            {'title': 'Настройки доступа', 'id': 16, 'parent@': true},
            {'title': 'Устройства', 'id': 17, 'parent@': false, 'parent': 16 },
            {'title': 'Подписи', 'id': 18, 'parent@': false},
            {'title': 'Имущество', 'id': 19, 'parent@': false}
         ];

         var source = new StaticSource({
               data: items,
               keyField: 'id',
               strategy: new ArrayStrategy()
            }
         );

         this.setDataSource(source);
      }
   });
   return DemoRightNavigationPanel;

});