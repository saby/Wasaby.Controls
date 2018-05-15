define('Controls-demo/OperationsPanel/OperationsPanel', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/OperationsPanel/OperationsPanel'
], function(Control, Memory, template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _currentClick: 'w8 4 click',
         _panelVisible: false,
         _template: template,
         _defaultItems: [
            {
               id: '1',
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
               icon: 'icon-Linked',
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
               title: 'Прикрепить к',
               '@parent': true,
               parent: null
            },
            {
               id: '7',
               title: 'Проекту',
               icon: 'icon-Link',
               '@parent': false,
               parent: '4'
            },
            {
               id: '8',
               title: 'Этапу',
               '@parent': false,
               parent: '4'
            },
            {
               id: '9',
               title: 'Согласование',
               '@parent': false,
               parent: '6'
            },
            {
               id: '10',
               title: 'Задача',
               '@parent': false,
               parent: '6'
            }
         ],
         _panelSource: null,
         _width: '540',
         _px: true,
         constructor: function() {
            this._itemClick = this._itemClick.bind(this);
            ModuleClass.superclass.constructor.apply(this, arguments);
            this._panelSource =  new Memory({
               idProperty: 'id',
               data: this._defaultItems
            });
         },

         _itemClick: function(event, item) {
            this._currentClick = 'Вы нажали на ' + item.getId();
         },

         _openClick: function(event, item) {
            this._panelVisible = !this._panelVisible;
         }
      });
   return ModuleClass;
});
