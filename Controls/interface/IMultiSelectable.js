define('Controls/interface/IMultiSelectable', [
], function() {

   /**
    * Interface for item selection in lists where multiple items can be selected at a time and the number of selected items is known. This interface is suitable for small lists where all items are always loaded.
    * @interface Controls/interface/IMultiSelectable
    * @public
    * @author Герасимов А.М.
    * @see Controls/interface/ISingleSelectable
    * @see Controls/interface/IPromisedSelectable
    */

   /**
    * @name Controls/interface/IMultiSelectable#selectedKeys
    * @cfg {Array.<Number|String>} Array of selected items' keys.
    * @default []
    * @example
    * The following example creates List and sets the selectedKeys to [1, 2, 3]. Subsequent changes made to selectedKeys will be synchronized through binding mechanism.
    * TMPL:
    * <pre>
    *    <Controls.List bind:selectedKeys="_selectedKeys" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [1, 2, 3];
    *    }
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see selectedKeysChanged
    */

   /**
    * @event Controls/interface/IMultiSelectable#selectedKeysChanged Occurs when selected keys were changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array.<Number|String>} keys Array of selected items' keys.
    * @param {Array.<Number|String>} added Array of keys added to selection.
    * @param {Array.<Number|String>} deleted Array of keys deleted from selection.
    * @remark
    * It's important to remember that we don't mutate selectedKeys array from options (or any other option). So keys in the event arguments and selectedKeys in the component's options are not the same array.
    * @example
    * The following example creates List, sets the selectedKeys to [1, 2, 3] and shows how to change message shown to the user based on selection.
    * TMPL:
    * <pre>
    *    <Controls.List on:selectedKeysChanged="onSelectedKeysChanged()" selectedKeys="{{ _selectedKeys }}" />
    *    <h1>{{ _message }}</h1>
    * </pre>
    * JS:
    * <pre>
    *     _beforeMount: function() {
    *       this._selectedKeys = [1, 2, 3];
    *    },
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
    * @see selectedKeys
    */
});
