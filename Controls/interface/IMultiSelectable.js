define('Controls/interface/IMultiSelectable', [
], function() {

   /**
    * Interface for item selection in lists where multiple items can be selected at a time and the number of selected items is known. This interface is suitable for small lists where all items are always loaded.
    * @interface Controls/interface/IMultiSelectable
    * @public
    * @see Controls/interface/ISingleSelectable
    * @see Controls/interface/IPromisedSelectable
    */

   /**
    * @name Controls/interface/IMultiSelectable#selectedKeys
    * @cfg {Array.<Number|String>} Array of selected items' keys.
    * @example
    * Select three items:
    * <pre>
    *    <Controls.List selectedKeys="{{ [1, 2, 5] }}" />
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    */

   /**
    * @event Controls/interface/IMultiSelectable#selectedKeysChanged Occurs when selected keys were changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array.<Number|String>} keys Array of selected items' keys.
    * @param {Array.<Number|String>} added Array of keys added to selection.
    * @param {Array.<Number|String>} deleted Array of keys deleted from selection.
    * @example
    * Change message shown to the user based on selection:
    * TMPL:
    * <pre>
    *    <Controls.List on:selectedKeysChanged="onSelectedKeysChanged()" selectedKeys="{{ _selectedKeys }}" />
    *    <h1>{{ _message }}</h1>
    * </pre>
    * JS:
    * <pre>
    *    onSelectedKeysChanged: function(e, keys, added, deleted) {
    *       this._selectedKeys = keys; //We don't use binding in this example so we have to update state manually.
    *       if (keys.length > 0) {
    *          this._message = 'Selected ' + keys.length + ' items.';
    *       } else {
    *          this._message = 'You have not selected any items.';
    *       }
    *    }
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    */
});
