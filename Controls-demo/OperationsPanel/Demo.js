define('Controls-demo/OperationsPanel/Demo', [
   'Core/Control',
   'wml!Controls-demo/OperationsPanel/Demo/Demo',
   'WS.Data/Source/Memory',
   'Controls-demo/List/Tree/TreeMemory',
   'Controls-demo/OperationsPanel/Demo/Data',
   'css!Controls-demo/OperationsPanel/Demo/Demo',
   'wml!Controls-demo/OperationsPanel/Demo/PersonInfo'
], function(Control, template, Memory, TreeMemory, Data) {
   'use strict';

   var filterButtonData = [{
      id: 'owner',
      resetValue: '0',
      value: '0'
   }];

   return Control.extend({
      _panelExpanded: false,
      _template: template,
      _panelSource: undefined,
      _nodeProperty: 'Раздел@',
      _parentProperty: 'Раздел',
      _viewSource: null,
      _moveDialogColumns: null,
      _gridColumns: null,
      _moveDialogFilter: null,
      _selectedKeys: null,
      _excludedKeys: null,
      _selectedKey: 0,
      _expanded: false,

      _beforeMount: function() {
         this._filterButtonSource = filterButtonData;
         this._panelSource = this._getPanelSource([]);
         this._itemActions = Data.itemActions;
         this._selectionChangeHandler = this._selectionChangeHandler.bind(this);
         this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
         this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
         this._moveDialogFilter = {
            onlyFolders: true
         };
         this._gridColumns = [{
            template: 'wml!Controls-demo/OperationsPanel/Demo/PersonInfo'
         }];
         this._moveDialogColumns = [{
            displayProperty: 'department'
         }];
         this._viewSource = new TreeMemory({
            idProperty: 'id',
            data: Data.employees
         });
         this._selectedKeys = [];
         this._excludedKeys = [];
      },

      _panelItemClick: function(event, item) {
         var itemId = item.get('id');
         switch (itemId) {
            case 'remove':
               this._removeItems();
               break;
            case 'move':
               this._moveItems();
               break;
            case 'PDF':
            case 'Excel':
               this._showPopup('Выгрузка в ' + itemId);
               break;
            case 'print':
               this._showPopup('Печать');
               break;
            case 'plainList':
               this._showPopup('Развернуть без подразделений');
               break;
            case 'sum':
               this._showPopup('Суммирование');
               break;
            case 'merge':
               this._showPopup('Объединение');
               break;
         }
      },

      _itemActionVisibilityCallback: function(action, item) {
         var
            index = this._items.getIndex(item),
            prevItem = this._items.at(index - 1),
            nextItem = this._items.at(index + 1);

         switch (action.id) {
            case 'moveUp':
               /* У первого не показывать кнопку вверх */
               return prevItem && prevItem.get('Раздел@') === item.get('Раздел@') && prevItem.get('Раздел') === item.get('Раздел');
            case 'moveDown':
               /* У последнего не показывать кнопку вниз */
               return nextItem && nextItem.get('Раздел@') === item.get('Раздел@') && nextItem.get('Раздел') === item.get('Раздел');
            default:
               return true;
         }
      },

      _itemActionsClick: function(event, action, item) {
         switch (action.id) {
            case 'moveUp':
               this._children.dialogMover.moveItemUp(item);
               break;
            case 'moveDown':
               this._children.dialogMover.moveItemDown(item);
               break;
            case 'remove':
               this._children.remover.removeItems([item.get('id')]);
               break;
         }
      },

      _onClickAddBlock: function() {
         this._showPopup('Клик в блок доп. операций');
      },

      _showPopup: function(text) {
         this._children.popupOpener.open({
            message: text,
            type: 'ok'
         });
      },

      _selectionChangeHandler: function(event, selectedKeys) {
         this._panelSource = this._getPanelSource(selectedKeys);
         this._forceUpdate();
      },

      _moveItems: function() {
         this._children.dialogMover.moveItemsWithDialog(this._selectedKeys);
      },

      _removeItems: function() {
         this._children.remover.removeItems(this._selectedKeys);
      },

      _afterItemsMove: function(event, items, target, position) {
         // To display the records in the correct order
         if (position === 'on') {
            this._children.list.reload();
         }
      },

      _beforeItemsRemove: function(event, items) {
         var
            self = this,
            removeFolders;

         items.forEach(function(key) {
            if (self._items.getRecordById(key).get(self._nodeProperty) === true) {
               removeFolders = true;
            }
         });

         return removeFolders ? this._children.popupOpener.open({
            message: 'Are you sure you want to delete the department?',
            type: 'yesno'
         }) : true;
      },

      _itemsReadyCallback: function(items) {
         this._items = items;
      },

      _getPanelSource: function(keys) {
         var items = Data.panelItems.slice();

         if (keys[0] !== null && !!keys.length) {
            items.unshift(Data.removeOperation);
            items.unshift(Data.moveOperation);
         }

         return new Memory({
            idProperty: 'id',
            data: items
         });
      }
   });
});
