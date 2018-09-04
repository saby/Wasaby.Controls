define('Controls/interface/IPromisedSelectable', [
], function() {

   /**
    * Interface for item selection in lists where multiple items can be selected at a time and the number of selected items is unknown. This interface is suitable for trees or lists with infinite scrolling where user can select items which are not loaded yet (e.g. through operations panel).
    * @interface Controls/interface/IPromisedSelectable
    * @public
    * @see Controls/interface/ISingleSelectable
    * @see Controls/interface/IMultiSelectable
    */

   /**
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selection.selected Array of selected keys.
    * @property {Array.<Number|String>} selection.excluded Array of excluded keys.
    * @see Controls/interface/ISource#keyProperty
    * @see selectedKeys
    * @see excludedKeys
    */

   /**
    * @name Controls/interface/IPromisedSelectable#selectedKeys
    * @cfg {Array.<Number|String>} Array of selected items' keys.
    * @remark
    * You can pass node's {@link Controls/interface/ISource#keyProperty key property} to select every item inside that node. To select every item in the list you should pass [null].
    * @example
    * Select everything except two items:
    * <pre>
    *    <Controls.Container.MultiSelector selectedKeys="{{ [null] }}" excludedKeys="{{ [1, 2] }}" />
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see excludedKeys
    * @see selectedKeysChanged
    */

   /**
    * @name Controls/interface/IPromisedSelectable#excludedKeys
    * @cfg {Array.<Number|String>} Array of keys of items that should be excluded from the selection.
    * @remark
    * A node will be marked as partially selected if key of any of its children is in excludedKeys. Partially selected nodes are usually rendered with checkbox in indeterminate state near them.
    * @example
    * Select everything except two items:
    * <pre>
    *    <Controls.Container.MultiSelector selectedKeys="{{ [null] }}" excludedKeys="{{ [1, 2] }}" />
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see selectedKeys
    * @see excludedKeysChanged
    */

   /**
    * Returns selection.
    * @function Controls/interface/IPromisedSelectable#getSelection
    * @returns {Selection} Selection.
    * @see selectedKeys
    * @see excludedKeys
    */

   /**
    * @event Controls/interface/IPromisedSelectable#selectedKeysChanged Occurs when selection was changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array.<Number|String>} keys Array of selected items' keys.
    * @param {Array.<Number|String>} added Array of keys added to selectedKeys.
    * @param {Array.<Number|String>} deleted Array of keys deleted from selectedKeys.
    * @example
    * Change items shown in the operations panel based on selection:
    * TMPL:
    * <pre>
    *    <Controls.Container.MultiSelector on:selectedKeysChanged="onSelectionChange()">
    *       <Controls.Operations.Panel source="{{ _panelSource }} />
    *    </Controls.Container.MultiSelector>
    * </pre>
    * JS:
    * <pre>
    *    onSelectionChange: function(e, selectedKeys, added, deleted) {
    *       this._panelSource = this._getPanelSource(selectedKeys);
    *    }
    * </pre>
    * @see selectedKeys
    */

   /**
    * @event Controls/interface/IPromisedSelectable#excludedKeysChanged Occurs when selection was changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array.<Number|String>} keys Array of keys of items that should be excluded from the selection.
    * @param {Array.<Number|String>} added Array of keys added to excludedKeys.
    * @param {Array.<Number|String>} deleted Array of keys deleted from excludedKeys.
    * @see excludedKeys
    */

});
