define('Controls/interface/IMovable', [
], function() {

   /**
    * Interface for item moving in collections.
    *
    * @interface Controls/interface/IMovable
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @typedef {String} MovePosition
    * @variant after Insert moved items after the specified item.
    * @variant before Insert moved items before the specified item.
    * @variant on Insert moved items into the specified item.
    */

   /**
    * @typedef {String} BeforeItemsMoveResult
    * @variant Custom Your own logic of moving items.
    * @variant MoveInItems Move in the list without calling move on source.
    */

   /**
    * @name Controls/interface/IMovable#moveDialogTemplate
    * @cfg {Function} The template of the dialog for selecting the target record to move.
    * @example
    * The following example shows how to using default template(Controls.List.Mover.MoveDialog).
    * <pre>
    *    <Controls.List.Mover>
    *       <ws:moveDialogTemplate>
    *          <Controls.List.Mover.MoveDialog
    *                root="rootId"
    *                searchParam="folderTitle"
    *                parentProperty="parent"
    *                nodeProperty="parent@">
    *             <ws:filter moveDialog="{{true}}"/>
    *          </Controls.List.Mover.MoveDialog>
    *       </ws:moveDialogTemplate>
    *    </Controls.List.Mover>
    * </pre>
    * @see moveItemsWithDialog
    * @see Controls/List/Mover/MoveDialog
    */

   /**
    * @event Controls/interface/IMovable#beforeItemsMove Occurs before the items are moved.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record|String|Number} target Target item to move.
    * @param {MovePosition} position Position to move.
    * @returns {BeforeItemsMoveResult}
    * @example
    * The following example shows how to override the default items move logic.
    * <pre>
    *    <Controls.List.Mover name="listMover" on:beforeItemsMove="_beforeItemsMove()"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _beforeItemsMove: function(eventObject, movedItems, target, position) {
    *          ...
    *          return 'Custom';
    *       }
    *       ...
    *    });
    * </pre>
    * @see afterItemsMove
    */

   /**
    * @event Controls/interface/IMovable#afterItemsMove Occurs after moving items.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {WS.Data/Entity/Record|String|Number} target Target item to move.
    * @param {MovePosition} position Position to move.
    * @param {*} result Result of moving items.
    * @example
    * The following example shows how to display the error dialog after a failed move of items.
    * <pre>
    *    <Controls.List.Mover name="listMover" on:afterItemsMove="_afterItemsMove()"/>
    *    <Controls.Popup.Opener.Confirmation name="popupOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _beforeItemsMove: function(eventObject, movedItems, target, position, result) {
    *          if (result instanseof Error) {
    *             return this._children.popupOpener.open({
    *                message: 'Removing records failed.',
    *                style: 'error'
    *             });
    *          }
    *       }
    *       ...
    *    });
    * </pre>
    * @see beforeItemsMove
    */

   /**
    * Move one item up.
    * @function Controls/interface/IMovable#moveItemUp
    * @param {String|Number} item The item to be moved.
    * @example
    * The following example shows how to move item up using the item actions.
    * <pre>
    *    <Controls.List itemActions="{{_itemActions}}"/>
    *    <Controls.List.Mover name="listMover"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _beforeMount: function() {
    *          var self = this;
    *          this._itemActions = [{
    *             icon: 'icon-ArrowUp',
    *             handler: function(item) {
    *                self._children.listMover.moveItemUp(item.getId());
    *             }
    *          }]
    *       }
    *       ...
    *    });
    * </pre>
    * @see moveItemDown
    * @see moveItems
    */

   /**
    * Move one item down.
    * @function Controls/interface/IMovable#moveItemDown
    * @param {String|Number} item The item to be moved.
    * @example
    * The following example shows how to move item down using the item actions.
    * <pre>
    *    <Controls.List itemActions="{{_itemActions}}"/>
    *    <Controls.List.Mover name="listMover"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _beforeMount: function() {
    *          var self = this;
    *          this._itemActions = [{
    *             icon: 'icon-ArrowDown',
    *             handler: function(item) {
    *                self._children.listMover.moveItemDown(item.getId());
    *             }
    *          }]
    *       }
    *       ...
    *    });
    * </pre>
    * @see moveItemUp
    * @see moveItems
    */

   /**
    * Moves the transferred items relative to the specified target item.
    * @function Controls/interface/IMovable#moveItems
    * @param {Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {String|Number} target Target item to move.
    * @param {MovePosition} position Position to move.
    * @remark
    * Depending on the 'position' argument, elements can be moved before, after or on the specified target item.
    * @example
    * The following example shows how to move item down using the item actions.
    * <pre>
    *    <Controls.Button caption="Move items in root" on:click="_moveItems()"/>
    *    <Controls.List.Mover name="listMover"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _selectedKeys: [],
    *       _moveItems: function() {
    *          this._children.listMover.moveItems(this._selectedKeys, 'rootId', 'on');
    *       }
    *       ...
    *    });
    * </pre>
    * @see moveItemUp
    * @see moveItemDown
    */

   /**
    * Move the transferred items with the pre-selection of the parent node using the dialog.
    * @function Controls/interface/IMovable#moveItemsWithDialog
    * @param {Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @remark
    * The component specified in the {@link moveDialogTemplate moveDialogTemplate} option will be used as a template for the move dialog.
    * @example
    * The following example shows how to move the selected items to the root by clicking the button.
    * <pre>
    *    <Controls.Button caption="Move items in root" on:click="_moveItems()"/>
    *    <Controls.List.Mover name="listMover"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _selectedKeys: [...],
    *       _moveItems: function() {
    *          this._children.listMover.moveItemsWithDialog(this._selectedKeys);
    *       }
    *       ...
    *    });
    * </pre>
    * @see moveItemUp
    * @see moveItemDown
    * @see moveItems
    */
});
