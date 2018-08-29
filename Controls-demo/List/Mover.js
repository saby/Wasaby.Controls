define('Controls-demo/List/Mover', [
   'Core/Control',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls-demo/List/Tree/TreeMemory',
   'Controls-demo/List/Tree/GridData',
   'tmpl!Controls-demo/List/Mover/Mover',
   'css!Controls-demo/List/Mover/Mover'
], function(BaseControl, cClone, Memory, TreeMemory, GridData, template) {
   'use strict';
   return BaseControl.extend({
      _template: template,
      _countClicked: 0,
      _reloadCaption: 'Reload',
      _columns: null,
      _treeSource: null,
      _itemActionsTree: null,
      _selectedKeys: null,
      _filter: null,
      demoItems: null,
      _viewSource: null,
      _viewSourceSecond: null,
      _private: null,

      _beforeMount: function() {
         var self = this;
         this._private = {
            createSource: function(items) {
               return new Memory({
                  idProperty: 'id',
                  data: cClone(items)
               });
            }
         };
         this.demoItems = [{
            id: 0,
            title: 'Перемещение записей 1'
         }, {
            id: 1,
            title: 'Перемещение записей 2'
         }, {
            id: 2,
            title: 'Перемещение записей 3'
         }, {
            id: 3,
            title: 'Перемещение записей 4'
         }];
         this._viewSource = this._private.createSource(this.demoItems);
         this._viewSourceSecond = this._private.createSource(this.demoItems);
         this._columns = [{
            displayProperty: 'Наименование'
         }];
         this._filter = {
            'ВидДерева': 'Только узлы'
         };
         this._treeSource = new TreeMemory({
            idProperty: 'id',
            data: GridData.catalog
         });
         this._itemActionsTree = [{
            id: 0,
            icon: 'icon-Move icon-primary',
            showType: 2
         }];
         this._selectedKeys = [];
         this._itemActions = this._createItemsActions('listMover');
         this._itemActionsSecond = this._createItemsActions('listSecondMover');
         this._itemActionsThird = this._createItemsActions('dialogMover');
         this._itemActionsThird.push({
            id: 3,
            icon: 'icon-Move icon-primary',
            showType: 2,
            handler: function(item) {
               self._children.dialogMover.moveItemsWithDialog([item.getId()]);
            }
         });
      },

      _onClick: function() {
         this._children.list.reload();
         this._children.listSecond.reload();
         this._countClicked += 1;
         this._reloadCaption = 'Reload ' + this._countClicked;
      },

      _beforeItemsMoveSecond: function() {
         return 'MoveInItems';
      },

      _createItemsActions: function(moverName) {
         var self = this;
         return [{
            id: 0,
            icon: 'icon-ArrowUp icon-primary',
            showType: 2,
            handler: function(item) {
               self._children[moverName].moveItemUp(item.getId());
            }
         }, {
            id: 1,
            icon: 'icon-ArrowDown icon-primary',
            showType: 2,
            handler: function(item) {
               self._children[moverName].moveItemDown(item.getId());
            }
         }];
      }
   });
});
