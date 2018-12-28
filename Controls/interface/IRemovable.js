define('Controls/interface/IRemovable', [], function() {


   /**
    * Interface for item removal in collections.
    *
    * @interface Controls/interface/IRemovable
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @event Controls/interface/IRemovable#beforeItemsRemove Occurs before items are removed.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of items to be removed.
    * @returns {Core/Deferred} If deferred was fullfilled with false then default logic will not be executed.
    * @example
    * The following example shows how to display a dialog with a question before deleting items.
    * <pre>
    *    <Controls.List.Remover name="listRemover" on:beforeItemsRemove="_beforeItemsRemove()"/>
    *    <Controls.Popup.Opener.Confirmation name="popupOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _beforeItemsRemove: function(eventObject, idArray) {
    *          return this._children.popupOpener.open({
    *             message: 'Are you sure you want to delete the items?',
    *             type: 'yesno'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see afterItemsRemove
    * @see removeItems
    */

   /**
    * @event Controls/interface/IRemovable#afterItemsRemove Occurs after removing items.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of removed items
    * @param {*} result The result of item removal from the data source.
    * @example
    * The following example shows how to remove items from list after click on the button.
    * <pre>
    *    <Controls.List.Remover name="listRemover" on:afterItemsRemove="_afterItemsRemove()"/>
    *    <Controls.Popup.Opener.Confirmation name="popupOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _afterItemsRemove: function(eventObject, idArray, result) {
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
    * @see removeItems
    * @see beforeItemsRemove
    */

   /**
    * Removes items from the data source by identifiers of the items in the collection.
    * @function Controls/interface/IRemovable#removeItems
    * @param {Array.<String>|Array.<Number>} items Array with the identifiers of the items in the collection.
    * @example
    * The following example shows how to remove items from list after click on the button.
    * <pre>
    *    <Controls.Button caption="RemoveItem" on:click="_onRemoveButtonClick()"/>
    *    <Controls.List.Remover name="listRemover"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _keysForRemove: [...],
    *
    *       _onRemoveButtonClick: function() {
    *          this._children.listRemover.removeItems(this._keysForRemove);
    *       }
    *       ...
    *    });
    * </pre>
    * @see afterItemsRemove
    * @see beforeItemsRemove
    */

});
