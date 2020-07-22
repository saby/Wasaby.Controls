define('Controls-demo/DragNDrop/Grid', [
   'Core/Control',
   'Core/core-clone',
   'Controls-demo/DragNDrop/DemoData',
   'Controls-demo/DragNDrop/ListEntity',
   'wml!Controls-demo/DragNDrop/Grid/Grid',
   'Types/source'
], function(BaseControl, cClone, DemoData, ListEntity, template, source) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _viewSource: null,
      _gridColumns: null,
      _gridHeader: null,

      _beforeMount: function() {
         this._selectedKeys = [];
         this._viewSource = new source.Memory({
            keyProperty: 'id',
            data: cClone(DemoData)
         });
         this._gridColumns = [{
            displayProperty: 'id'
         }, {
            displayProperty: 'title'
         }, {
            displayProperty: 'additional'
         }];
         this._gridHeader = [{
            title: 'ID'
         }, {
            title: 'Title'
         }, {
            title: 'Additional'
         }];
      },
      _dragStart: function(event, items, draggedKey) {
         return draggedKey === 0 ? false : new ListEntity({
            items: items
         });
      },
      _dragEnd: function(event, entity, target, position) {
         this._children.listMover.moveItems(entity.getItems(), target, position);
      }
   });

   return ModuleClass;
});
