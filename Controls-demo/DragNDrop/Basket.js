define('Controls-demo/DragNDrop/Basket', [
   'Core/Control',
   'Core/core-instance',
   'tmpl!Controls-demo/DragNDrop/Basket/Basket',
   'css!Controls-demo/DragNDrop/Basket/Basket'
], function(BaseControl, cInstance, template) {
   'use strict';

   var Basket = BaseControl.extend({
      _template: template,
      _canDrop: false,
      _items: [],

      _dragInit: function() {
         this._canDrop = true;
      },

      _dragReset: function(event, dragObject) {
         var
            id,
            items;
         if (this._isDragEnter) {
            items = dragObject.entity.getItems();
            items.forEach(function(item) {
               id = item.getId();
               if (this._items.indexOf(id) === -1) {
                  this._items.push(id);
               }
            }, this);
         }
         this._canDrop = false;
      }
   });

   return Basket;
});
