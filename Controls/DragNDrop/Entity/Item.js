define('Controls/DragNDrop/Entity/Item', ['Controls/DragNDrop/Entity'],
   function(Entity) {
      'use strict';

      var Item = Entity.extend({
         getItem: function() {
            return this._options.item;
         }
      });

      return Item;
   });
