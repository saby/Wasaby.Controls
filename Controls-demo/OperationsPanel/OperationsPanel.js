define('Controls-demo/OperationsPanel/OperationsPanel', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/OperationsPanel/OperationsPanel',
   'Controls/List',
   'Controls/List/MassSelector',
   'Controls/Container/MassSelector'
], function(Control, Memory, template) {
   'use strict';

   var srcData = [
      {
         id: 1,
         title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
         description: 'Другое название 1'
      },
      {
         id: 2,
         title: 'Notebooks 2',
         description: 'Описание вот такое'
      },
      {
         id: 3,
         title: 'Smartphones 3 ',
         description: 'Хватит страдать'

      }
   ];
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
            this._viewSource = new Memory({
               idProperty: 'id',
               data: srcData
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
