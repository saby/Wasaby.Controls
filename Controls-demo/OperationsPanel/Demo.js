define('Controls-demo/OperationsPanel/Demo', [
   'Core/Control',
   'tmpl!Controls-demo/OperationsPanel/Demo/Demo',
   'WS.Data/Source/Memory',
   'Controls-demo/List/Tree/TreeMemory',
   'Controls-demo/OperationsPanel/Demo/Data',
   'css!Controls-demo/OperationsPanel/Demo/Demo',
   'tmpl!Controls-demo/OperationsPanel/Demo/PersonInfo'
], function(Control, template, Memory, TreeMemory, Data) {
   'use strict';

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

      _beforeMount: function() {
         this._panelSource = this._getPanelSource([]);
         this._selectionChangeHandler = this._selectionChangeHandler.bind(this);
         this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
         this._moveDialogFilter = {
            onlyFolders: true
         };
         this._gridColumns = [{
            template: 'tmpl!Controls-demo/OperationsPanel/Demo/PersonInfo'
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

      _afterItemsMove: function() {
         //TODO: иначе дереву совсем плохо
         //https://online.sbis.ru/opendoc.html?guid=d413c319-1e28-4ddf-ad5f-4605ec69a758
         this._children.list.reload();
      },

      _afterItemsRemove: function() {
         //TODO: иначе выделению совсем плохо
         //https://online.sbis.ru/opendoc.html?guid=b8c5c496-4c9e-425e-b90e-0ecfbf9b1f91
         this._children.remover._notify('selectedTypeChanged', ['unselectAll'], {
            bubbling: true
         });
         if (this._removeFolders) {
            this._children.list.reload();
            this._removeFolders = false;
         }
      },

      _beforeItemsRemove: function(event, items) {
         var self = this;

         items.forEach(function(key) {
            if (self._items.getRecordById(key).get(self._nodeProperty) === true) {
               self._removeFolders = true;
            }
         });

         return self._removeFolders ? this._children.popupOpener.open({
            message: 'Are you sure you want to delete the department?',
            type: 'yesno'
         }) : true;
      },

      _itemsReadyCallback: function(items) {
         this._items = items;
      },

      _getPanelSource: function(keys) {
         var
            item,
            leafs = 0,
            self = this,
            items = Data.panelItems.slice();
         if (keys[0] !== null && !!keys.length) {
            items.unshift(Data.removeOperation);
         }

         keys.forEach(function(key) {
            item = self._items.getRecordById(key);
            if (item && !item.get(self._nodeProperty)) {
               leafs++;
            }
         });

         if (leafs >= 2) {
            items.push(Data.mergeOperation);
         }
         return new Memory({
            idProperty: 'id',
            data: items
         });
      }
   });
});
