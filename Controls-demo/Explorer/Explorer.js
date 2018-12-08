define('Controls-demo/Explorer/Explorer', [
   'Core/Control',
   'wml!Controls-demo/Explorer/Explorer',
   'Controls-demo/Explorer/ExplorerMemory',
   'Controls-demo/Explorer/ExplorerImages',
   'css!Controls-demo/Explorer/Explorer',
   'Controls/Explorer'
], function(BaseControl, template, MemorySource, explorerImages) {
   'use strict';
   var
      ModuleClass = BaseControl.extend({
         _template: template,
         _viewSource: null,
         _viewColumns: null,
         _itemsHeight: 200,
         _viewMode: 'table',
         _selectedKeys: [],
         _excludedKeys: [],
         _changeViewIcon: 'icon-ArrangePreview',
         _beforeMount: function() {
            this._viewColumns = [
               {
                  displayProperty: 'title',
                  width: '1fr'
               }
            ];
            this._itemActions = [
               {
                  id: 1,
                  icon: 'icon-PhoneNull',
                  title: 'phone',
                  showType: 0,
                  handler: function(item) {
                     console.log('action phone Click ', item);
                  }
               },
               {
                  id: 2,
                  icon: 'icon-EmptyMessage',
                  title: 'message',
                  showType: 0,
                  handler: function() {
                     alert('Message Click');
                  }
               },
               {
                  id: 3,
                  icon: 'icon-Profile',
                  title: 'profile',
                  showType: 0,
                  handler: function() {
                     console.log('action profile Click');
                  }
               },
               {
                  id: 4,
                  icon: 'icon-Erase',
                  iconStyle: 'danger',
                  title: 'delete pls',
                  showType: 0,
                  handler: function() {
                     console.log('action delete Click');
                  }
               },
               {
                  id: 5,
                  icon: 'icon-PhoneNull',
                  title: 'phone',
                  showType: 0,
                  handler: function(item) {
                     console.log('action phone Click ', item);
                  }
               },
               {
                  id: 6,
                  icon: 'icon-EmptyMessage',
                  title: 'message',
                  showType: 0,
                  handler: function() {
                     alert('Message Click');
                  }
               },
               {
                  id: 7,
                  icon: 'icon-Profile',
                  title: 'profile',
                  showType: 0,
                  handler: function() {
                     console.log('action profile Click');
                  }
               },
               {
                  id: 8,
                  icon: 'icon-Erase',
                  iconStyle: 'danger',
                  title: 'delete pls',
                  showType: 0,
                  handler: function() {
                     console.log('action delete Click');
                  }
               }
            ];
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: [{
                  id: 1,
                  'parent': null,
                  'parent@': true,
                  title: 'Документы отделов'
               }, {
                  id: 11,
                  'parent': 1,
                  'parent@': true,
                  title: '1. Электронный документооборот'
               }, {
                  id: 12,
                  'parent': 1,
                  'parent@': true,
                  title: '2. Отчетность через интернет'
               }, {
                  id: 13,
                  'parent': 1,
                  'parent@': null,
                  title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                  image: explorerImages[4],
                  isDocument: true
               }, {
                  id: 111,
                  'parent': 11,
                  'parent@': true,
                  title: 'Задачи'
               }, {
                  id: 112,
                  'parent': 11,
                  'parent@': null,
                  title: 'Сравнение систем по учету рабочего времени.xlsx',
                  image: explorerImages[5],
                  isDocument: true
               }, {
                  id: 2,
                  'parent': null,
                  'parent@': true,
                  title: 'Техническое задание'
               }, {
                  id: 21,
                  'parent': 2,
                  'parent@': null,
                  title: 'PandaDoc.docx',
                  image: explorerImages[6],
                  isDocument: true
               }, {
                  id: 22,
                  'parent': 2,
                  'parent@': null,
                  title: 'SignEasy.docx',
                  image: explorerImages[7],
                  isDocument: true
               }, {
                  id: 3,
                  'parent': null,
                  'parent@': true,
                  title: 'Анализ конкурентов'
               }, {
                  id: 4,
                  'parent': null,
                  'parent@': null,
                  title: 'Договор на поставку печатной продукции',
                  image: explorerImages[0],
                  isDocument: true
               }, {
                  id: 5,
                  'parent': null,
                  'parent@': null,
                  title: 'Договор аренды помещения',
                  image: explorerImages[1],
                  isDocument: true
               }, {
                  id: 6,
                  'parent': null,
                  'parent@': null,
                  title: 'Конфеты',
                  image: explorerImages[3]

               }, {
                  id: 7,
                  'parent': null,
                  'parent@': null,
                  title: 'Скриншот от 25.12.16, 11-37-16',
                  image: explorerImages[2],
                  isDocument: true
               }]
            });
         },
         _changeViewMode: function() {
            this._viewMode = this._viewMode === 'tile' ? 'table' : 'tile';
            this._changeViewIcon = this._viewMode === 'tile' ? 'icon-ArrangeList' : 'icon-ArrangePreview';
         }
      });

   return ModuleClass;
});
