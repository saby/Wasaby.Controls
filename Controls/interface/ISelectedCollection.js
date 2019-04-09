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
    * @cfg {String} Name of the item property which content will be displayed.
    */

   /**
    * @name Controls/interface/ISelectedCollection#multiSelect
    * @cfg {Boolean} Selection mode, if value false you can choose only one item.
    */

   /**
    * @name Controls/interface/ISelectedCollection#maxVisibleItems
    * @cfg {Integer} The maximum number of items to display, the rest will be hidden under the counter.
    */

   /**
    * @name Controls/List/interface/IList#dataLoadCallback
    * @cfg {Function} Callback function that will be called when list data loaded by source
    */

   /**
    * @name Controls/interface/ISelectedCollection#itemTemplate
    * @cfg {Function|String} Selected item template.
    * @remark
    * Base itemTemplate for Controls/Selector/Lookup: "wml!Controls/Selector/Lookup/itemTemplate".
    * Base itemTemplate for Controls/Selector/Button: "wml!Controls/Selector/Button/itemTemplate".
    * Base itemTemplate supports these parameters:
    * <ul>
    *    <li>contentTemplate {Function|String} - Template for render item content.</li>
    *    <li>crossTemplate {Function|String} - Template for render cross.</li>
    *    <li>displayProperty {String} - Name of the item property which content will be displayed.</li>
    *    <li>clickable {Boolean} - Specifies whether elements are clickable, adds an underscore when the element is hover, is only valid if the default value is used for the contentTemplate.</li>
    *    <li>size {Enum} - The text size for the item content, is only valid if the default value is used for the contentTemplate.</li>
    *    <ul>
    *       <li>m</li>
    *       <li>l</li>
    *       <li>xl</li>
    *       <li>2xl</li>
    *       <li>3xl</li>
    *    </ul>
    *    <li>style {Enum} - The text style for the item content, is only valid if the default value is used for the contentTemplate.</li>
    *    <ul>
    *       <li>default</li>
    *       <li>bold</li>
    *       <li>accent</li>
    *       <li>primary</li>
    *    </ul>
    * </ul>
    *
    * If you reimplement contentTemplate/crossTemplate, you will not be notified of itemClick/crossClick events.
    * To work properly, you need to mark your content with classes:
    * <ul>
    *    <li>js-controls-SelectedCollection__item__caption</li>
    *    <li>js-controls-SelectedCollection__item__cross</li>
    * </ul>
    *
    * @example
    * WML:
    * <pre>
    *    <Controls.Selector.Button
    *          source="{{_source}}"
    *          keyProperty="id">
    *       <ws:itemTemplate>
    *          <ws:partial template="wml!Controls/Selector/Button/itemTemplate"
    *                      style="primary"
    *                      size="xl"
    *                      displayProperty="title"
    *                      clickable="{{true}}"/>
    *       </ws:itemTemplate>
    *    </Controls.Selector.Button>
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#textValueChanged Occurs when changing the set of the selected collection.
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

   /**
    * @event Controls/interface/ISelectedCollection#itemsChanged Occurs when changing the set of the selected collection.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {RecordSet} items List of selected entries.
    * @example
    * The following example creates Selector/Button and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.Selector.Button
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:itemsChanged="onItemsChanged()"
    *    </Controls.Selector.Button>
    * </pre>
    * JS:
    * <pre>
    *    onItemsChanged: function(e, items) {
    *       this.prepareItems(items);
    *    }
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#itemClick Occurs when clicking on a collection item.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {RecordSet} item Item selected collection.
    */
});
