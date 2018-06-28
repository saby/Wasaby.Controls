define('Controls-demo/List/Mover', [
   'Core/Control',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/List/Mover/Mover',
   'css!Controls-demo/List/Mover/Mover'
], function (BaseControl, cClone, Memory, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      __lastClicked: 0,
      __reload: "Reload",
      _itemActions: undefined,
      _items: [{
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
      }],

      _beforeMount: function() {
         this._viewSource = this._createSource(this._items);
         this._viewSourceSecond = this._createSource(this._items);
         this._itemActions = this._createItemsActions('list');
         this._itemActionsSecond = this._createItemsActions('listSecond');
      },

      _createSource: function(items) {
         return new Memory({
            idProperty: 'id',
            data: cClone(items)
         });
      },

      _onClick: function() {
         this._children.list.reload();
         this._children.listSecond.reload();
         this.__lastClicked += 1;
         this.__reload = "Reload " + this.__lastClicked;
      },

      _beforeItemsMoveSecond: function() {
         return 'MoveInItems';
      },

      _createItemsActions: function(listName) {
         var self = this;
         return [{
            id: 0,
            icon: 'icon-ArrowUp icon-primary',
            showType: 2,
            handler: function(item) {
               self._children[listName].moveItemUp(item);
            }
         },{
            id: 1,
            icon: 'icon-ArrowDown icon-primary',
            showType: 2,
            handler: function(item) {
               self._children[listName].moveItemDown(item);
            }
         }];
      }
   });
   return ModuleClass;
});
