define('Controls/interface/ISelectedCollection', [
], function() {

   /**
    * Interface to select items from the list
    * @interface Controls/interface/ISelectedCollection
    * @public
    * @author Капустин И.А.
    */

   /**
    * @name Controls/interface/ISelectedCollection#displayProperty
    * @cfg {String="title"} Name of the item property which content will be displayed.
    */

   /**
    * @name Controls/interface/ISelectedCollection#multiSelect
    * @cfg {Boolean} Records selection mode, if value false you can choose only one entry
    */

   /**
    * @name Controls/interface/ISelectedCollection#selectorTemplate
    * @cfg {Function} Template for panel with collection.
    * @example
    * In the following example, we will create a lookup by specifying selectorTemplate, before this we define the templateOptions value in advance.
    * WML:
    * <pre>
    *    <Controls.Selector.Lookup
    *       source="{{_source}}"
    *       searchParam="title"
    *       keyProperty="id"
    *       <ws:selectorTemplate templateName="Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector" templateOptions="{{_templateOptions}}"/>
    *    </Controls.Selector.Lookup>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._source = new Memory();
    *       this._templateOptions = {
    *          handlers: {
    *             onSelectComplete: function() {}
    *          }
    *       };
    *    }
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#textValueChanged Happens when changing the set of the selected collection.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {String} textValue String formed from selected entries.
    * @example
    * The following example creates Selector/Button and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.Selector.Button
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:textValueChanged="onTextValueChanged()"
    *    </Controls.Selector.Button>
    * </pre>
    * JS:
    * <pre>
    *    onTextValueChanged: function(e, textValue) {
    *       UserConfig.setParam('selectedItems', textValue);
    *    }
    * </pre>
    */
});
