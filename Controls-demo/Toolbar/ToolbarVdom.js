define('Controls-demo/Toolbar/ToolbarVdom', [
   'Core/Control',
   'Types/source',
   'wml!Controls-demo/Toolbar/ToolbarVdom',
   'css!Controls-demo/Toolbar/ToolbarVdom',
   'wml!Controls-demo/Toolbar/resources/itemTemplate',
   'wml!Controls-demo/Toolbar/resources/itemTemplateContent'
], function(Control, source, template) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _defaultItems: null,
         _flatItems: null,
         _currentClick: 'Нажми на тулбар',

         _getDefaultMemory: function() {
            return new source.Memory({
               idProperty: 'id',
               data: this._defaultItems
            });
         },

         _getMemorySource: function(items) {
            return new source.Memory({
               idProperty: 'id',
               data: items
            });
         },

         constructor: function() {
            this._itemClick = this._itemClick.bind(this);
            ModuleClass.superclass.constructor.apply(this, arguments);
            this._defaultItems = [
               {
                  id: '1',
                  showType: 2,
                  icon: 'icon-Time icon-medium',
                  '@parent': false,
                  parent: null
               },
               {
                  id: '3',
                  icon: 'icon-Print icon-medium',
                  title: 'Распечатать',
                  '@parent': false,
                  parent: null
               },
               {
                  id: '4',
                  buttonIcon: 'icon-24 icon-Linked',
                  buttonStyle: 'secondary',
                  buttonViewMode: 'toolButton',
                  buttonIconStyle: 'secondary',
                  buttonTransparent: false,
                  title: 'Связанные документы',
                  '@parent': true,
                  parent: null
               },
               {
                  id: '5',
                  buttonViewMode: 'icon',
                  icon: 'icon-Link icon-medium',
                  title: 'Скопировать в буфер',
                  '@parent': false,
                  parent: null
               },
               {
                  id: '6',
                  showType: 0,
                  title: 'Прикрепить к',
                  '@parent': false,
                  parent: null
               },
               {
                  id: '7',
                  showType: 0,
                  title: 'Проекту',
                  '@parent': false,
                  parent: '4'
               },
               {
                  id: '8',
                  showType: 0,
                  title: 'Этапу',
                  '@parent': false,
                  parent: '4'
               },
               {
                  id: '9',
                  title: 'Согласование',
                  '@parent': false,
                  parent: '2'
               },
               {
                  id: '10',
                  title: 'Задача',
                  '@parent': false,
                  parent: '2'
               },
               {
                  id: '11',
                  icon: 'icon-medium icon-EmptyMessage',
                  buttonStyle: 'secondary',
                  showHeader: true,
                  buttonViewMode: 'link',
                  buttonIconStyle: 'secondary',
                  buttonTransparent: false,
                  title: 'Обсудить',
                  '@parent': true,
                  parent: null
               },
               {
                  id: '12',
                  showType: 0,
                  title: 'Видеозвонок',
                  '@parent': false,
                  parent: '11'
               },
               {
                  id: '13',
                  showType: 0,
                  title: 'Сообщение',
                  '@parent': false,
                  parent: '11'
               }
            ];
            this._defaultItemsWithoutToolbutton = [
               {
                  id: '1',
                  icon: 'icon-Print icon-medium',
                  title: 'Распечатать',
                  '@parent': false,
                  parent: null
               },
               {
                  id: '2',
                  buttonViewMode: 'icon',
                  icon: 'icon-Link icon-medium',
                  title: 'Скопировать в буфер',
                  '@parent': false,
                  parent: null
               },
               {
                  id: '3',
                  showType: 0,
                  title: 'Прикрепить к',
                  '@parent': false,
                  parent: null
               },
               {
                  id: '4',
                  showType: 0,
                  title: 'Проекту',
                  '@parent': false,
                  parent: '3'
               },
               {
                  id: '5',
                  showType: 0,
                  title: 'Этапу',
                  '@parent': false,
                  parent: '3'
               },
               {
                  id: '6',
                  icon: 'icon-medium icon-EmptyMessage',
                  buttonStyle: 'secondary',
                  showHeader: true,
                  buttonViewMode: 'link',
                  buttonIconStyle: 'secondary',
                  buttonTransparent: false,
                  title: 'Обсудить',
                  '@parent': true,
                  parent: null
               },
               {
                  id: '7',
                  showType: 0,
                  title: 'Видеозвонок',
                  '@parent': false,
                  parent: '6'
               },
               {
                  id: '8',
                  showType: 0,
                  title: 'Сообщение',
                  '@parent': false,
                  parent: '6'
               }
            ];
            this._flatItems = [
               {
                  id: '1',
                  showType: 2,
                  buttonIcon: 'icon-Time  icon-medium',
                  buttonStyle: 'secondary',
                  buttonViewMode: 'toolButton',
                  buttonIconStyle: 'secondary',
                  buttonTransparent: false,
                  title: 'Время',
                  '@parent': true,
                  parent: null
               },
               {
                  id: '2',
                  showType: 2,
                  buttonIcon: 'icon-Linked icon-medium',
                  buttonStyle: 'secondary',
                  buttonViewMode: 'toolButton',
                  buttonIconStyle: 'secondary',
                  buttonTransparent: false,
                  title: 'Связанные документы'
               },
               {
                  id: '3',
                  showType: 2,
                  buttonIcon: 'icon-Author icon-medium',
                  buttonStyle: 'secondary',
                  buttonViewMode: 'toolButton',
                  buttonIconStyle: 'secondary',
                  buttonTransparent: false,
                  title: 'Автор'
               }
            ];
         },

         _itemClick: function(event, item) {
            this._currentClick = 'Вы нажали на ' + item.getId();
         }
      });
   return ModuleClass;
});
