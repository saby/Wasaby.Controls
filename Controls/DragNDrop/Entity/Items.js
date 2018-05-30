define('Controls/DragNDrop/Entity/Items', ['Controls/DragNDrop/Entity'], function(Entity) {
   'use strict';

   return Entity.extend({
      getItems: function() {
         return this._options.items;
      }
   });
});
