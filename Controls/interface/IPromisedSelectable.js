define('Controls/interface/IPromisedSelectable', [
], function() {

   /**
    * Interface for item selection in lists where multiple items can be selected at a time and the number of selected items is unknown. This interface is suitable for trees or lists with infinite scrolling where user can select items which are not loaded yet (e.g. through operations panel).
    * @interface Controls/interface/IPromisedSelectable
    * @public
    * @author Зайцев А.С.
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
    * @default []
    * @remark
    * You can pass node's {@link Controls/interface/ISource#keyProperty key property} to select every item inside that node. To select every item in the list you should pass [null].
    * @example
    * The following example creates List and selects everything except two items. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism.
    * TMPL:
    * <pre>
    *    <Controls.Container.MultiSelector bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [null];
    *       this._excludedKeys = [1, 2];
    *    }
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see excludedKeys
    * @see selectedKeysChanged
    */

   /**
    * @name Controls/interface/IPromisedSelectable#excludedKeys
    * @cfg {Array.<Number|String>} Array of keys of items that should be excluded from the selection.
    * @default []
    * @remark
    * A node will be marked as partially selected if key of any of its children is in excludedKeys. Partially selected nodes are usually rendered with checkbox in indeterminate state near them.
    * @example
    * The following example creates List and selects everything except two items. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism.
    * TMPL:
    * <pre>
    *    <Controls.Container.MultiSelector bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [null];
    *       this._excludedKeys = [1, 2];
    *    }
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see selectedKeys
    * @see excludedKeysChanged
    */

   /**
    * @event Controls/interface/IPromisedSelectable#selectedKeysChanged Occurs when selection was changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array.<Number|String>} keys Array of selected items' keys.
    * @param {Array.<Number|String>} added Array of keys added to selectedKeys.
    * @param {Array.<Number|String>} deleted Array of keys deleted from selectedKeys.
    * @remark
    * It's important to remember that we don't mutate selectedKeys array from options (or any other option). So keys in the event arguments and selectedKeys in the component's options are not the same array.
    * @example
    * The following example creates List with empty selection. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism. Source of the operations panel will be updated every time selectedKeys change.
    * TMPL:
    * <pre>
    *    <Controls.Container.MultiSelector on:selectedKeysChanged="onSelectedKeysChanged()" bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys">
    *       <Controls.Operations.Panel source="{{ _panelSource }} />
    *    </Controls.Container.MultiSelector>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [];
    *       this._excludedKeys = [];
    *    },
    *    onSelectedKeysChanged: function(e, selectedKeys, added, deleted) {
    *       this._panelSource = this._getPanelSource(selectedKeys); //Note that we simultaneously have event handler and bind for the same option, so we don't have to update state manually.
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
    * @remark
    * It's important to remember that we don't mutate excludedKeys array from options (or any other option). So keys in the event arguments and excludedKeys in the component's options are not the same array.
    * @example
    * The following example creates List with empty selection. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism. Source of the operations panel will be updated every time excludedKeys change.
    * TMPL:
    * <pre>
    *    <Controls.Container.MultiSelector on:excludedKeysChanged="onExcludedKeysChanged()" bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys">
    *       <Controls.Operations.Panel source="{{ _panelSource }} />
    *    </Controls.Container.MultiSelector>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [];
    *       this._excludedKeys = [];
    *    },
    *    onExcludedKeysChanged: function(e, excludedKeys, added, deleted) {
    *       this._panelSource = this._getPanelSource(excludedKeys); //Note that we simultaneously have event handler and bind for the same option, so we don't have to update state manually.
    *    }
    * </pre>
    * @see excludedKeys
    */

});
