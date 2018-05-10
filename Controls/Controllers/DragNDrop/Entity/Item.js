define('Controls/Controllers/DragNDrop/Entity/Item', ['Controls/Controllers/DragNDrop/Entity', 'WS.Data/Di'],
   function(Entity, Di) {
      'use strict';

      var Item = Entity.extend({
         getItem: function() {
            return this._options.item;
         }
      });

      Di.register('dragentity.item', Item);
      return Item;
   });
