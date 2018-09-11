define('Controls/interface/ISingleSelectable', [
], function() {

   /**
    * Interface for item selection in lists where only one item can be selected at a time.
    *
    * @interface Controls/interface/ISingleSelectable
    * @public
    * @see Controls/interface/IMultiSelectable
    * @see Controls/interface/IPromisedSelectable
    */

   /**
    * @name Controls/interface/ISingleSelectable#selectedKey
    * @cfg {?(Number|String)} Key of selected item.
    * @default null
    * @example
    * The following example creates ComboBox and sets the selectedKey to 1. Subsequent changes made to selectedKey will be synchronized through binding mechanism.
    * TMPL:
    * <pre>
    *    <Controls.Input.ComboBox bind:selectedKey="{{ _selectedKey }}" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKey = 1;
    *    }
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see selectedKeyChanged
    */

   /**
    * @event Controls/interface/ISingleSelectable#selectedKeyChanged Occurs when selected key changes.
    * @param {?(Number|String)} key Key of selected item.
    * @example
    * The following example creates ComboBox, sets the selectedKey to 1 and shows how to handle the event.
    * TMPL:
    * <pre>
    *    <Controls.Input.ComboBox on:selectedKeyChanged="onSelectedKeyChanged()" selectedKey="{{ _selectedKey }}" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKey = 1;
    *    },
    *    onSelectedKeyChanged: function(e, key) {
    *       if (key === 3) { //Let's say that we want to make item with the key 3 unselectable.
    *          return;
    *       } else {
    *          this._selectedKey = key;
    *       }
    *    }
    * </pre>
    * @see Controls/interface/ISource#keyProperty
    * @see selectedKey
    */

});
