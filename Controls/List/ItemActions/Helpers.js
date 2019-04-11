define('Controls/List/ItemActions/Helpers', ['Controls/_lists/ItemActions/Helpers'], function(Control) {
/**
 * List of helpers for displaying item actions.
 * @class Controls/list:ItemActionsHelpers
 * @public
 * @author Сухоручкин А.С.
 * @category List
 */
   /** @typedef {String} MoveDirection
     *  @variant {String} up Move up
     *  @variant {String} down Move down
     */
   /**
     * Helper to display up/down item actions.
     * @param {MoveDirection} direction
     * @param {Types/entity:Record} item Instance of the item whose action is being processed.
     * @param {Types/collection:RecordSet} items List of all items.
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
   return Control;
});
