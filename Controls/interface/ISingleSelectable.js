define('Controls/interface/ISingleSelectable', [
], function() {

   /**
    * Interface for item selection in lists where only one item can be selected at a time.
    *
    * @interface Controls/interface/ISingleSelectable
    * @public
    * @author Зайцев А.С.
    * @see Controls/interface/IMultiSelectable
    * @see Controls/interface/IPromisedSelectable
    */

   /**
    * @name Controls/interface/ISingleSelectable#selectedKey
    * @cfg {Number|String} Selected item key.
    * @default Undefined
    * @example
    * The following example creates RadioGroup and selects first item. Subsequent changes made to selectedKey will be synchronized through binding mechanism.
    * <pre>
    *    <Controls.Toggle.RadioGroup bind:selectedKey="_selectedKey"/>
    * </pre>
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = '1';
    *    }
    * </pre>
    * @see selectedKeyChanged
    * @see keyProperty
    */

   /**
    * @event Controls/interface/ISingleSelectable#selectedKeyChanged Occurs when selection was changed.
    * @param {Number|String} key Selected item key.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @example
    * The following example creates RadioGroup with empty selection. Subsequent changes made to selectedKey will be synchronized through binding mechanism. Source of the operations panel will be updated every time selectedKey change.
    * <pre>
    *    <Controls.Container.RadioGroup on:selectedKeyChanged="onSelectedKeyChanged()" bind:selectedKey="_selectedKey">
    *       <Controls.Operations.Panel source="{{ _panelSource }} />
    *    </Controls.Container.RadioGroup>
    * </pre>
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKey = undefined;
    *    },
    *    onSelectedKeysChanged: function(e, selectedKey) {
    *
    *       //Note that we simultaneously have event handler and bind for the same option, so we don't have to update state manually.
    *       this._panelSource = this._getPanelSource(selectedKey);
    *    }
    * </pre>
    * @see selectedKey
    */

});
