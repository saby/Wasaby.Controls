define('Controls/interface/IReorderMovable', [
], function() {

   /**
    * Interface for changing the order of items in the collection.
    *
    * @mixin Controls/interface/IReorderMovable
    * @public
    */

   /**
    * @typedef {String} ReorderMovePosition
    * @variant after Insert moved items after the specified item.
    * @variant before Insert moved items before the specified item.
    */

   /**
    * @typedef {String} BeforeItemsMoveResult
    * @variant Custom Your own logic of moving items.
    * @variant MoveInItems Move in the list without calling move on source.
    */

   /**
    * @event Controls/interface/IReorderMovable#beforeItemsMove Occurs before items are moved.
    * @param {Array.<WS.Data/Entity/Record>|Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record} target Movement target item (moved items will be placed before of after this item).
    * @param {ReorderMovePosition} position Movement positioning.
    * @returns {BeforeItemsMoveResult}
    */

   /**
    * @event Controls/interface/IReorderMovable#afterItemsMove Occurs after items were moved.
    * @param {Array.<WS.Data/Entity/Record>|Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record} target Movement target item (moved items will be placed before of after this item).
    * @param {ReorderMovePosition} position Movement positioning.
    * @param {*} result Result of moving items.
    */

   /**
    * Move one item up.
    * @function Controls/interface/IReorderMovable#moveItemUp
    * @param {WS.Data/Entity/Record} item Item that should be moved.
    */

   /**
    * Move one item down.
    * @function Controls/interface/IReorderMovable#moveItemDown
    * @param {WS.Data/Entity/Record} item Item that should be moved.
    */

   /**
    * Moves the transferred items.
    * @function Controls/interface/IReorderMovable#moveItems
    * @param {Array.<WS.Data/Entity/Record>|Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record} target Movement target item (moved items will be placed before of after this item).
    * @param {ReorderMovePosition} position Movement positioning.
    */
});
