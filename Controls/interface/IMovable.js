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
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selected Array of selected keys.
    * @property {Array.<Number|String>} excluded Array of excluded keys.
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
    * The following example shows how to using default template(Controls.list:View.Mover.MoveDialog).
    * <pre>
    *    <Controls.list:View.Mover>
    *       <ws:moveDialogTemplate>
    *          <Controls.list:View.Mover.MoveDialog
    *                root="rootId"
    *                searchParam="folderTitle"
    *                parentProperty="parent"
    *                nodeProperty="parent@">
    *             <ws:filter moveDialog="{{true}}"/>
    *          </Controls.list:View.Mover.MoveDialog>
    *       </ws:moveDialogTemplate>
    *    </Controls.list:View.Mover>
    * </pre>
    * @see moveItemsWithDialog
    * @see Controls.list:View/Mover/MoveDialog
    */

   /**
    * @name Controls/interface/IMovable#sortingOrder
    * @cfg {String} Determines which sort is set on the dataSource.
    * @variant asc Ascending sort.
    * @variant desc Descending sort.
    * @default asc
    * @remark This option is necessary to specify the order in which the data is located in the source,
    * so that when changing the sequence numbers, the items are moved to the correct position.
    * @example
    * The following example shows how to set a descending sort.
    * <pre>
    *    <Controls.list:View.Mover sortingOrder="desc">
    *       <ws:moveDialogTemplate>
    *          <Controls.list:View.Mover.MoveDialog
    *                root="rootId"
    *                searchParam="folderTitle"
    *                parentProperty="parent"
    *                nodeProperty="parent@">
    *             <ws:filter moveDialog="{{true}}"/>
    *          </Controls.list:View.Mover.MoveDialog>
    *       </ws:moveDialogTemplate>
    *    </Controls.list:View.Mover>
    * </pre>
    */

   /**
    * @event Controls/interface/IMovable#beforeItemsMove Occurs before the items are moved.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {Types/entity:Record|String|Number} target Target item to move.
    * @param {MovePosition} position Position to move.
    * @returns {BeforeItemsMoveResult}
    * @example
    * The following example shows how to override the default items move logic.
    * <pre>
    *    <Controls.list:View.Mover name="listMover" on:beforeItemsMove="_beforeItemsMove()"/>
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
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} movedItems Array of items to be moved.
    * @param {Types/entity:Record|String|Number} target Target item to move.
    * @param {MovePosition} position Position to move.
    * @param {*} result Result of moving items.
    * @example
    * The following example shows how to display the error dialog after a failed move of items.
    * <pre>
    *    <Controls.list:View.Mover name="listMover" on:afterItemsMove="_afterItemsMove()"/>
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
    * @returns {Core/Deferred} Deferred with the result of the move.
    * @example
    * The following example shows how to move item up using the item actions.
    * <pre>
    *    <Controls.list:View itemActions="{{_itemActions}}"/>
    *    <Controls.list:View.Mover name="listMover"/>
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
    * @returns {Core/Deferred} Deferred with the result of the move.
    * @example
    * The following example shows how to move item down using the item actions.
    * <pre>
    *    <Controls.list:View itemActions="{{_itemActions}}"/>
    *    <Controls.list:View.Mover name="listMover"/>
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
    * @param {Array.<String>|Array.<Number>|Selection} movedItems Items to be moved.
    * @param {String|Number} target Target item to move.
    * @param {MovePosition} position Position to move.
    * @returns {Core/Deferred} Deferred with the result of the move.
    * @remark
    * Depending on the 'position' argument, elements can be moved before, after or on the specified target item.
    * @example
    * The following example shows how to move item down using the item actions.
    * <pre>
    *    <Controls.Button caption="Move items in root" on:click="_moveItems()"/>
    *    <Controls.list:View.Mover name="listMover"/>
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
    * @param {Array.<String>|Array.<Number>|Selection} movedItems Items to be moved.
    * @remark
    * The component specified in the {@link moveDialogTemplate moveDialogTemplate} option will be used as a template for the move dialog.
    * @example
    * The following example shows how to move the selected items to the root by clicking the button.
    * <pre>
    *    <Controls.Button caption="Move items in root" on:click="_moveItems()"/>
    *    <Controls.list:View.Mover name="listMover"/>
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
