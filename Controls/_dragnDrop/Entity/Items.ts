import Entity = require('Controls/_dragnDrop/Entity');
   

   /**
    * The base class for the inheritors of the drag'n'drop entity in the list.
    * You can customize an entity in any way by passing any data to the options.
    * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
    * @class Controls/_dragnDrop/Entity/Items
    * @public
    * @author Авраменко А.С.
    * @category DragNDrop
    */

   /**
    * @name Controls/_dragnDrop/Entity/Items#items
    * @cfg {Array.<String>} The list of items to move.
    * @remark In the process of moving, a thumbnail of the entity being moved is shown near the cursor.
    * @see Controls/_list/interface/IDraggable#dragStart
    */

    var Items = Entity.extend({
      getItems: function() {
         return this._options.items;
      }
   });

   export = Items;
