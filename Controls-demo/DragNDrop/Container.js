define('Controls-demo/DragNDrop/Container', [
   'Core/Control',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls-demo/DragNDrop/ListEntity',
   'Controls-demo/DragNDrop/Container/DemoData',
   'tmpl!Controls-demo/DragNDrop/Container/Container',
   'css!Controls-demo/DragNDrop/Container/Container',
   'Controls/DragNDrop/Avatar'
], function(BaseControl, cClone, Memory, ListEntity, DemoData, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _itemActions: undefined,

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
