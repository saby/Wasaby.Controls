define('Controls-demo/DragNDrop/List', [
   'Core/Control',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls-demo/DragNDrop/ListEntity',
   'Controls-demo/DragNDrop/List/DemoData',
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

      _beforeMount: function() {
         this._viewSource = this._createSource(DemoData);
      },

      _dragStart: function(event, items) {
         var hasBadItems = false;
         items.forEach(function(item) {
            if (item.getId() === 0) {
               hasBadItems = true;
            }
         });
         return hasBadItems ? false : new ListEntity({
            items: items
         });
      },

      _createSource: function(items) {
         return new Memory({
            idProperty: 'id',
            data: cClone(items)
         });
      }
   });
   return ModuleClass;
});
