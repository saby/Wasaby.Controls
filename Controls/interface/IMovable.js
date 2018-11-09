define('Controls/interface/IMovable', [
], function() {

   /**
    * Interface for changing the order of items in the collection.
    *
    * @interface Controls/interface/IMovable
    * @public
    * @author Волоцкой В.Д.
    */

   /**
    * @typedef {String} MovePosition
    * @variant after Insert moved items after the specified item.
    * @variant before Insert moved items before the specified item.
    */

   /**
    * @typedef {String} BeforeItemsMoveResult
    * @variant Custom Your own logic of moving items.
    * @variant MoveInItems Move in the list without calling move on source.
    */

   /**
    * @event Controls/interface/IMovable#beforeItemsMove Occurs before items are moved.
    * @param {Array.<WS.Data/Entity/Record>|Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record|String|Number} target Movement target item (moved items will be placed before of after this item).
    * @param {MovePosition} position Movement positioning.
    * @returns {BeforeItemsMoveResult}
    */

   /**
    * @event Controls/interface/IMovable#afterItemsMove Occurs after items were moved.
    * @param {Array.<WS.Data/Entity/Record>|Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record|String|Number} target Movement target item (moved items will be placed before of after this item).
    * @param {MovePosition} position Movement positioning.
    * @param {*} result Result of moving items.
    */

   /**
    * Move one item up.
    * @function Controls/interface/IMovable#moveItemUp
    * @param {WS.Data/Entity/Record|String|Number} item Item that should be moved.
    */

   /**
    * Move one item down.
    * @function Controls/interface/IMovable#moveItemDown
    * @param {WS.Data/Entity/Record|String|Number} item Item that should be moved.
    */

   /**
    * Moves the transferred items.
    * @function Controls/interface/IMovable#moveItems
    * @param {Array.<WS.Data/Entity/Record>|Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record|String|Number} target Movement target item (moved items will be placed before of after this item).
    * @param {MovePosition} position Movement positioning.
    */
});
