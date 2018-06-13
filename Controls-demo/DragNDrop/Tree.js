define('Controls-demo/DragNDrop/Tree', [
   'Core/Control',
   'Controls-demo/DragNDrop/DemoData',
   'Controls-demo/DragNDrop/ListEntity',
   'tmpl!Controls-demo/DragNDrop/Tree/Tree',
   'Controls-demo/List/Tree/TreeMemory'
], function(BaseControl, DemoData, ListEntity, template, TreeMemory) {

   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,

      _viewSource: new TreeMemory({
         idProperty: 'id',
         data: DemoData
      }),

      _gridColumns: [{
         displayProperty: 'id'
      }, {
         displayProperty: 'title'
      }, {
         displayProperty: 'additional'
      }],

      _gridHeader: [{
         title: 'ID'
      }, {
         title: 'Title'
      }, {
         title: 'Additional'
      }],

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
      }
   });

   return ModuleClass;
});
