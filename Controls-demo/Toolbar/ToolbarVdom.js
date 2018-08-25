define('Controls-demo/Toolbar/ToolbarVdom', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Toolbar/ToolbarVdom',
   'css!Controls-demo/Toolbar/ToolbarVdom',
   'tmpl!Controls-demo/Toolbar/resources/itemTemplate',
   'tmpl!Controls-demo/Toolbar/resources/itemTemplateContent'
], function(Control, Memory, template) {
   'use strict';
   var flatItems = [
      {
         id: '1',
         showType: 2,
         icon: 'icon-Time'
      },
      {
         id: '2',
         showType: 2,
         icon: 'icon-Linked',
         title: 'Связанные документы',
         myTemplate: 'tmpl!Controls-demo/Toolbar/resources/itemTemplate'
      },
      {
         id: '3',
         showType: 2,
         title: 'Скопировать в буфер'
      }
   ];
   var defaultItems = [
      {
         id: '1',
         showType: 2,
         icon: 'icon-Time',
         '@parent': false,
         parent: null
      },
      {
         id: '3',
         icon: 'icon-Print',
         title: 'Распечатать',
         '@parent': false,
         parent: null
      },
      {
         id: '4',
         buttonIcon: 'icon-24 icon-Linked',
         buttonStyle: 'iconButtonBordered',
         buttonIconStyle: 'done',
         title: 'Связанные документы',
         '@parent': true,
         parent: null
      },
      {
         id: '5',
         icon: 'icon-Link',
         title: 'Скопировать в буфер',
         '@parent': false,
         parent: null
      },
      {
         id: '6',
         showType: 0,
         title: 'Прикрепить к',
         '@parent': true,
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
      }
   ];
   var ModuleClass = Control.extend(
      {
         _template: template,
         _defaultItems: null,
         _flatItems: null,
         _currentClick: 'Нажми на тулбар',

         _getDefaultMemory: function() {
            return new Memory({
               idProperty: 'id',
               data: this._defaultItems
            });
         },

         _getMemorySource: function(items) {
            return new Memory({
               idProperty: 'id',
               data: items
            });
         },

         constructor: function() {
            this._itemClick = this._itemClick.bind(this);
            ModuleClass.superclass.constructor.apply(this, arguments);
            this._defaultItems = defaultItems;
            this._flatItems = flatItems;
         },

         _itemClick: function(event, item) {
            this._currentClick = 'Вы нажали на ' + item.getId();
         }
      });
   return ModuleClass;
});
