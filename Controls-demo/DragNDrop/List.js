define('Controls-demo/DragNDrop/List', [
   'Core/Control',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls-demo/DragNDrop/ListEntity',
   'Controls-demo/DragNDrop/DemoData',
   'tmpl!Controls-demo/DragNDrop/List/List',
   'css!Controls-demo/DragNDrop/List/List',
   'Controls/DragNDrop/Avatar'
], function(BaseControl, cClone, Memory, ListEntity, DemoData, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _itemActions: [{
         title: 'Action',
         showType: 2,
         id: 0
      }],
      _viewSource: new Memory({
         idProperty: 'id',
         data: cClone(DemoData)
      }),

      _beforeMount: function() {
         this._itemsReadyCallback = this._itemsReady.bind(this);
      },

      _itemsReady: function(items) {
         this._items = items;
      },

      _dragEnd: function(event, items, target, position) {
         this._children.listMover.moveItems(items, target, position);
      },

      _dragStart: function(event, items) {
         var
            hasBadItems = false;
         items.forEach(function(item) {
            if (item === 0) {
               hasBadItems = true;
            }
         });
         return hasBadItems ? false : new ListEntity({
            items: items,
            firstItem: this._items.getRecordById(items[0])
         });
      }
   });
   return ModuleClass;
});
