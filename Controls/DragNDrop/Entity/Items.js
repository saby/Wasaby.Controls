define('Controls/DragNDrop/Entity/Items', ['Controls/DragNDrop/Entity'], function(Entity) {
   'use strict';

   /**
    * The base class for the inheritors of the drag'n'drop entity in the list.
    * You can customize an entity in any way by passing any data to the options.
    * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
    * @class Controls/DragNDrop/Entity/Items
    * @public
    * @author Авраменко А.С.
    * @category DragNDrop
    */

   /**
    * @name Controls/DragNDrop/Entity/Items#items
    * @cfg {Array.<String>} The list of items to move.
    * @remark In the process of moving, a thumbnail of the entity being moved is shown near the cursor.
    * @see Controls/List/interface/IDraggable#dragStart
    */

   return Entity.extend({
      getItems: function() {
         return this._options.items;
      }
   });
});
