define('Controls-demo/List/Tree/TreeWithPhoto', [
   'Core/Control',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto',
   'Controls-demo/List/Tree/TreeMemory',
   'css!Controls-demo/List/Tree/TreeWithPhoto',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto-content',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto-item16',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto-item24',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto-item32',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto-item40',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto-itemTwoLevels',
   'tmpl!Controls-demo/List/Tree/TreeWithPhoto-contentTwoLevels',
   'Controls/TreeGrid'
], function(BaseControl, template, MemorySource) {

   'use strict';

   var
      ModuleClass = BaseControl.extend({
         _template: template,
         _viewSource: new MemorySource({
            idProperty: 'id',
            data: [
               {  id: 1,   title: 'Node',         'Раздел': null, 'Раздел@': true,  'Раздел$': null, photo: '' },
               {  id: 11,  title: 'Node',         'Раздел': 1,    'Раздел@': true,  'Раздел$': null, photo: '' },
               {  id: 111, title: 'Leaf',         'Раздел': 11,   'Раздел@': null,  'Раздел$': null, photo: 'List/Grid/data/krainov.png' },
               {  id: 12,  title: 'Leaf',         'Раздел': 1,    'Раздел@': null,  'Раздел$': null, photo: 'List/Grid/data/korbyt.png' },
               {  id: 13,  title: 'Hidden node',  'Раздел': 1,    'Раздел@': false, 'Раздел$': true, photo: 'List/Grid/data/dogadkin.png' },
               {  id: 2,   title: 'Empty node',   'Раздел': null, 'Раздел@': true,  'Раздел$': null, photo: '' },
               {  id: 3,   title: 'Hidden node',  'Раздел': null, 'Раздел@': false, 'Раздел$': true, photo: 'List/Grid/data/krainov.png' },
               {  id: 31,  title: 'Leaf',         'Раздел': 3,    'Раздел@': null,  'Раздел$': null, photo: 'List/Grid/data/korbyt.png' },
               {  id: 4,   title: 'Empty hidden', 'Раздел': null, 'Раздел@': false, 'Раздел$': false, photo: 'List/Grid/data/dogadkin.png' },
               {  id: 5,   title: 'Leaf',         'Раздел': null, 'Раздел@': null,  'Раздел$': null, photo: 'List/Grid/data/korbyt.png' }
            ]
         }),

         _viewSourceTwoLevels: new MemorySource({
            idProperty: 'id',
            data: [
               {  id: 1, title: 'Крайнов Дмитрий', 'Раздел': null, 'Раздел@': true, photo: 'List/Grid/data/krainov.png' },
               {  id: 2, title: 'Корбут Антон', 'Раздел': null, 'Раздел@': true, photo: 'List/Grid/data/korbyt.png' },
               {  id: 3, title: 'Догадкин Владимир', 'Раздел': null, 'Раздел@': true, photo: 'List/Grid/data/dogadkin.png' },
               {  id: 11, title: 'Шеврон платформенно появляется с отступом от самого длинного поля', 'Раздел': 1, 'Раздел@': null,  photo: null },
               {  id: 12, title: 'Разработать макет блока для реестров (наподобии информационого)', 'Раздел': 1, 'Раздел@': null,  photo: null },
               {  id: 13, title: 'Стандартизовать выезжающую панель бв такмо виде как на скринах', 'Раздел': 1, 'Раздел@': null,  photo: null },
               {  id: 21, title: 'Шапка этой панекли всё ещё не соотвествует стандарту: высота нестандартная', 'Раздел': 2, 'Раздел@': null,  photo: null },
               {  id: 22, title: 'Необходимо, при наличии панели действий, предоставить возможность выводить чекбоксы', 'Раздел': 2, 'Раздел@': null,  photo: null },
               {  id: 23, title: 'В окне большой корзины смещена базовая линия у колонки "сумма"', 'Раздел': 3, 'Раздел@': null,  photo: null },
               {  id: 31, title: 'Необходимо заполнять ссылки для декорированрия дефолтными плашками', 'Раздел': 3, 'Раздел@': null,  photo: null },
               {  id: 32, title: 'Необходимо событие при ошибке записи данных в редактировании по месту', 'Раздел': 3, 'Раздел@': null,  photo: null }
            ]
         }),

         _viewColumns: [
            {
               displayProperty: 'title',
               width: '1fr',
               template: 'tmpl!Controls-demo/List/Tree/TreeWithPhoto-content'
            }
         ],

         _viewColumnsTwoLevels: [
            {
               displayProperty: 'title',
               width: '1fr',
               template: 'tmpl!Controls-demo/List/Tree/TreeWithPhoto-contentTwoLevels'
            }
         ]
      });

   return ModuleClass;
});
