define('Controls-demo/OperationsPanel/OperationsPanel', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/OperationsPanel/OperationsPanel',
   'Controls-demo/List/Tree/GridData',
   'Controls-demo/List/Tree/TreeMemory',
   'Controls/List',
   'Controls/List/MultiSelector',
   'Controls/Container/MultiSelector',
   'css!Controls-demo/OperationsPanel/OperationsPanel'
], function(Control, Memory, template, GridData, TreeMemory) {
   'use strict';
   var deleteItem = {
         id: 0,
         icon: 'icon-Erase icon-error',
         '@parent': false,
         title: 'Удалить',
         parent: null
      },
      defaultItems = [
         deleteItem,
         {
            id: 1,
            icon: 'icon-Time',
            '@parent': false,
            parent: null
         },
         {
            id: 2,
            icon: 'icon-Move',
            title: 'Перенести',
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
      _columns: [{
         displayProperty: 'Наименование'
      }],
      _moverFiler: {
         onlyFolders: true
      },

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
         this._viewSource = new TreeMemory({
            idProperty: 'id',
            data: GridData.catalog
         });
      },

      _itemClick: function(event, item) {
         var itemId = item.getId();
         this._currentClick = 'Вы нажали на ' + itemId;
         var selected = this._children.multiSelector.getSelection().selected;
         if (itemId === 0) {
            if (selected && selected.length && selected[0] === null) {
               this._showError('невозможно удалить всё');
            } else {
               this._children.remover.removeItems(selected);
            }
         }
         if (itemId === 2) {
            if (selected && selected.length) {
               this._children.dialogMover.moveItemsWithDialog(selected);
            } else {
               this._showError('Необходимо выбрать записи');
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

      _selectionChange: function(e, selection) {
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
