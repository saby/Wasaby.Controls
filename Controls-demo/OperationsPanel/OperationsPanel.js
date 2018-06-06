define('Controls-demo/OperationsPanel/OperationsPanel', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/OperationsPanel/OperationsPanel',
   'Controls/List',
   'Controls/List/MassSelector',
   'Controls/Container/MassSelector',
   'css!Controls-demo/OperationsPanel/OperationsPanel'
], function(Control, Memory, template) {
   'use strict';
   var deleteItem = {
         id: 0,
         icon: 'icon-Erase icon-error',
         '@parent': false,
         title: 'Удалить',
         parent: null
      },
      srcData = [
         {
            id: 1,
            title:
               'Настолько длинное название папки что оно не влезет в максимальный размер'
         },
         {
            id: 2,
            title: 'Notebooks'
         },
         {
            id: 3,
            title: 'Smartphones'
         },
         {
            id: 4,
            title: 'Notebook Lenovo G505 59426068'
         },
         {
            id: 5,
            title: 'Notebook Packard Bell EasyNote TE69HW-29572G32'
         },
         {
            id: 6,
            title: 'Notebook ASUS X550LC-XO228H'
         },
         {
            id: 7,
            title: 'Notebook Lenovo IdeaPad G5030 (80G0001FRK)'
         },
         {
            id: 8,
            title: 'Notebook Lenovo G505 59426068'
         },
         {
            id: 9,
            title: 'Lenovo'
         },
         {
            id: 10,
            title:
               'Настолько длинное название папки что оно не влезет в максимальный размер'
         }
      ],
      defaultItems = [
         deleteItem,
         {
            id: 1,
            icon: 'icon-Time',
            '@parent': false,
            parent: null
         },
         {
            id: 3,
            icon: 'icon-Print',
            title: 'Распечатать',
            '@parent': false,
            parent: null
         },
         {
            id: 4,
            icon: 'icon-Linked',
            title: 'Связанные документы',
            '@parent': true,
            parent: null
         },
         {
            id: 5,
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            parent: null
         },
         {
            id: 6,
            title: 'Прикрепить к',
            '@parent': true,
            parent: null
         },
         {
            id: 7,
            title: 'Проекту',
            icon: 'icon-Link',
            '@parent': false,
            parent: '4'
         },
         {
            id: 8,
            title: 'Этапу',
            '@parent': false,
            parent: '4'
         },
         {
            id: 9,
            title: 'Согласование',
            '@parent': false,
            parent: '6'
         },
         {
            id: 10,
            title: 'Задача',
            '@parent': false,
            parent: '6'
         }
      ];

   var ModuleClass = Control.extend({
      _currentClick: 'w8 4 click',
      _panelVisible: false,
      _template: template,
      _panelSource: null,
      _width: '540',
      _px: true,
      _sourceCount: 15,

      constructor: function() {
         this._itemClick = this._itemClick.bind(this);
         this._selectionChange = this._selectionChange.bind(this);
         ModuleClass.superclass.constructor.apply(this, arguments);
         this._createPanelSource();
         this._createSource();
         this._itemActions = this._createItemsActions();
      },

      _createItemsActions: function() {
         var self = this;
         return [
            {
               id: 0,
               icon: 'icon-Erase icon-error',
               showType: 2,
               handler: function(item) {
                  self._children.listView.removeItems([item.getId()]);
               }
            }
         ];
      },

      _createPanelSource: function() {
         this._panelSource = new Memory({
            idProperty: 'id',
            data: defaultItems
         });

      },

      _createSource: function() {
         var newData = [];
         for (var i = 0; i < +this._sourceCount; i++) {
            var item = {
               id: i,
               title: srcData[i % 10].title + ' ' + i
            };
            newData.push(item);
         }
         this._viewSource = new Memory({
            idProperty: 'id',
            data: newData
         });
      },

      _itemClick: function(event, item) {
         var itemId = item.getId();
         this._currentClick = 'Вы нажали на ' + itemId;
         if (itemId === 0) {
            var selected = this._children.massSelector.getSelection().selected;
            if (selected && selected.length && selected[0] === null) {
               this._showError('невозможно удалить всё');
            } else {
               this._children.listView.removeItems(selected);
            }
         }
      },

      _openClick: function() {
         this._panelVisible = !this._panelVisible;
      },

      _showError: function(message) {
         this._children.popupOpener.open({
            message: message,
            style: 'error',
            type: 'ok'
         });
      },

      _selectionChange: function(selection) {
         var selected = selection.selected;
         if (!selected || !selected.length) {
            defaultItems.shift();
            this._createPanelSource();
         } else if (defaultItems[0] !== deleteItem) {
            defaultItems.unshift(deleteItem);
            this._createPanelSource();
         }
      },

      _beforeItemsRemove: function() {
         return this._children.popupOpener.open({
            message: 'Remove items?',
            type: 'yesno'
         });
      }
   });
   return ModuleClass;
});
