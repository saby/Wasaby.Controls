define('Controls-demo/Explorer/Explorer', [
   'Core/Control',
   'tmpl!Controls-demo/Explorer/Explorer',
   'Controls-demo/Explorer/ExplorerMemory',
   'css!Controls-demo/Explorer/Explorer',
   'Controls/Explorer'
], function(BaseControl, template, MemorySource) {

   'use strict';

   var
      ModuleClass = BaseControl.extend({
         _template: template,
         _viewSource: new MemorySource({
            idProperty: 'id',
            data: [
               {  id: 1,   'parent': null, 'parent@': true, title: 'В фокусе (3)' },
               {  id: 11,  'parent': 1,    'parent@': true, title: 'Поручения отделу кадров (1)' },
               {  id: 12,  'parent': 1,    'parent@': true, title: 'Ошибки' },
               {  id: 13,  'parent': 1,    'parent@': null, title: 'Нужно подумать о внесении в стандарт редактирования по месту данного поведения' },
               {  id: 111, 'parent': 11,   'parent@': true, title: 'Задачи' },
               {  id: 112, 'parent': 11,   'parent@': null, title: 'Отпуск Ежегодный с 26.07.18 по 27.07.18 "Компания "Тензор" ООО' },
               {  id: 2,   'parent': null, 'parent@': true, title: 'Аккордеон (2)' },
               {  id: 21,  'parent': 2,    'parent@': null, title: 'Утечка памяти при построении складского отчета продаж' },
               {  id: 22,  'parent': 2,    'parent@': null, title: 'Нет тултипов у значений мин и макс у суммарных значений' },
               {  id: 3,   'parent': null, 'parent@': true, title: 'Задачи 3.7.3.100' },
               {  id: 4,   'parent': null, 'parent@': null, title: 'Разработать проект стандарта Хлебные крошки' },
               {  id: 5,   'parent': null, 'parent@': null, title: 'Разобраться с цветом правого аккордеона, лент и тд.' }
            ]
         }),

         _viewColumns: [
            {
               displayProperty: 'title',
               width: '1fr'
            }
         ]
      });

   return ModuleClass;
});
