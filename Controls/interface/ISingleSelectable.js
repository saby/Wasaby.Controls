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
    * @cfg {Number|String} Key of selected item.
    * @remark
    * Key is the value of the item's {@link Controls/interface/ISource#keyProperty key property}.
    * @example
    * Select item:
    * <pre>
    *    <Controls.Input.ComboBox selectedKey="1" />
    * </pre>
    */

   /**
    * @event Controls/interface/ISingleSelectable#selectedKeyChanged Occurs when selected item changes.
    * @param {Number|String} key Key of selected item.
    * @remark
    * Key is the value of the item's {@link Controls/interface/ISource#keyProperty key property}.
    * @example
    * Forbid choosing item with the key '3':
    * TMPL:
    * <pre>
    *    <Controls.Input.ComboBox on:selectedKeyChanged="onSelectedKeyChanged()" selectedKey="{{ _selectedKey }}" />
    * </pre>
    * JS:
    * <pre>
    *    onSelectedKeyChanged: function(e, key) {
    *       if (key === '3') {
    *          return;
    *       } else {
    *          this._selectedKey = key; //We don't use binding in this example so we have to update state manually.
    *       }
    *    }
    * </pre>
    */

});
