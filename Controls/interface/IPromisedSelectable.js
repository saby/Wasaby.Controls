define('Controls/interface/IPromisedSelectable', [
], function() {

   /**
    * Interface for item selection in lists where multiple items can be selected at a time and the number of selected
    * items is unknown. This interface is suitable for trees or lists with infinite scrolling where user can select
    * items which are not loaded yet (e.g. through operations panel).
    *
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
    * @variant [null] Everything is selected.
    * @variant [] Nothing is selected.
    * @remark
    * Selected keys and excluded keys from options are only used during first render and after this it's impossible to
    * change selection through these two options.
    * @example
    * Select everything except two items:
    * <pre>
    *    <Controls.Container.MultiSelector selectedKeys="{{ [null] }}" excludedKeys="{{ [1, 2] }}" />
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see excludedKeys
    */

   /**
    * @name Controls/interface/IPromisedSelectable#excludedKeys
    * @cfg {Array.<Number|String>} Array of keys of items that should be excluded from the selection.
    * @remark
    * Selected keys and excluded keys from options are only used during first render and after this it's impossible to
    * change selection through these two options.
    * @example
    * Select everything except two items:
    * <pre>
    *    <Controls.Container.MultiSelector selectedKeys="{{ [null] }}" excludedKeys="{{ [1, 2] }}" />
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see selectedKeys
    */

   /**
    * Returns selection.
    * @function Controls/interface/IPromisedSelectable#getSelection
    * @returns {Selection} Selection.
    * @see selectedKeys
    * @see excludedKeys
    */

   /**
    * @event Controls/interface/IPromisedSelectable#selectionChange Occurs when selection was changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Selection} Selection object.
    * @example
    * Change items shown in the operations panel based on selection:
    * TMPL:
    * <pre>
    *    <Controls.Container.MultiSelector on:selectionChange="onSelectionChange()">
    *       <Controls.Operations.Panel source="{{ _panelSource }} />
    *    </Controls.Container.MultiSelector>
    * </pre>
    * JS:
    * <pre>
    *    onSelectionChange: function(e, selection) {
    *       this._panelSource = this._getPanelSource(selection.selected);
    *    }
    * </pre>
    * @see getSelection
    */

});
