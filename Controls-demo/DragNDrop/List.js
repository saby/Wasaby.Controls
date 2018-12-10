define('Controls-demo/DragNDrop/List', [
   'Core/Control',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls-demo/DragNDrop/ListEntity',
   'Controls-demo/DragNDrop/DemoData',
   'wml!Controls-demo/DragNDrop/List/List',
   'css!Controls-demo/DragNDrop/List/List',
   'Controls/DragNDrop/DraggingTemplate'
], function(BaseControl, cClone, Memory, ListEntity, DemoData, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _itemActions: null,
      _viewSource: null,

      _beforeMount: function() {
         this._itemsReadyCallback = this._itemsReady.bind(this);
         this._itemActions = [{
            title: 'Action',
            showType: 2,
            id: 0
         }];
         this._viewSource = new Memory({
            idProperty: 'id',
            data: cClone(DemoData)
         });
      },

      _itemsReady: function(items) {
         this._items = items;
      },

      _dragEnd: function(event, entity, target, position) {
         this._children.listMover.moveItems(entity.getItems(), target, position);
      },

      _dragStart: function(event, items) {
         var
            hasBadItems = false,
            firstItem = this._items.getRecordById(items[0]);

         items.forEach(function(item) {
            if (item === '0') {
               hasBadItems = true;
            }
         });
         return hasBadItems ? false : new ListEntity({
            items: items,
            mainText: firstItem.get('title'),
            image: firstItem.get('image'),
            additionalText: firstItem.get('additional')
         });
      }
   });
   return ModuleClass;
});
