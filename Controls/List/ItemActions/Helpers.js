define('Controls/List/ItemActions/Helpers', [], function() {
   'use strict';

   /**
    * List of helpers for displaying item actions.
    * @class Controls/List/ItemActions/Helpers
    * @public
    * @author Сухоручкин А.С.
    * @category List
    */

   var MOVE_DIRECTION = {
      'UP': 'up',
      'DOWN': 'down'
   };

   var helpers = {

      /** @typedef {String} MoveDirection
       *  @variant {String} up Move up
       *  @variant {String} down Move down
       */

      /**
       * Helper to display up/down item actions.
       * @param {MoveDirection} direction
       * @param {WS.Data/Entity/Record} item Instance of the item whose action is being processed.
       * @param {WS.Data/Collection/RecordSet} items List of all items.
       * @param {Controls/List/interface/IHierarchy#parentProperty} parentProperty Name of the field that contains information about parent node.
       * @param {Controls/List/interface/IHierarchy#nodeProperty} nodeProperty Name of the field describing the type of the node (list, node, hidden node).
       */

      /**
       * @example
       * In the following example, only items that are in the same parent are allowed to be moved.
       * JS:
       * <pre>
       * _itemActionVisibilityCallback: function(action, item) {
       *    var result = true;
       *
       *    if (action.id === 'up' || action.id === 'down') {
       *       result = visibilityCallback.reorderMoveActionsVisibility(action.id, item, this._items, 'Parent');
       *    }
       *
       *    return result;
       * }
       * </pre>
       * 
       * In the following example, only items that are in the same parent and have the same type are allowed to be moved.
       * JS:
       * <pre>
       * _itemActionVisibilityCallback: function(action, item) {
       *    var result = true;
       *
       *    if (action.id === 'up' || action.id === 'down') {
       *       result = visibilityCallback.reorderMoveActionsVisibility(action.id, item, this._items, 'Parent', 'Parent@');
       *    }
       *
       *    return result;
       * }
       * </pre>
       */
      reorderMoveActionsVisibility: function(direction, item, items, parentProperty, nodeProperty) {
         var
            index = items.getIndex(item),
            siblingItem = items.at(index + (direction === MOVE_DIRECTION.UP ? -1 : 1));

         return !!siblingItem &&
            (!parentProperty || siblingItem.get(parentProperty) === item.get(parentProperty)) && //items in one folder
            (!nodeProperty || siblingItem.get(nodeProperty) === item.get(nodeProperty));//items of the same type
      }
   };

   helpers.MOVE_DIRECTION = MOVE_DIRECTION;

   return helpers;
});
