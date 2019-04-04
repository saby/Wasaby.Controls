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
    * @param {Function|String} contentTemplate Template for render item content.
    * @param {Function|String} crossTemplate Template for render cross.
    * @param {String} displayProperty Name of the item property which content will be displayed.
    * @param {Boolean} clickable Specifies whether elements are clickable, adds an underscore when the element is hover.
    *
    * @param {Enum} size The text size for the item content, is only valid if the default value is used for the contentTemplate.
    * @variant m
    * @variant l
    * @variant xl
    * @variant 2xl
    * @variant 3xl
    * @default m
    *
    * @param {Enum} style The text style for the item content, is only valid if the default value is used for the contentTemplate.
    * @variant bold
    * @variant accent
    * @variant primary
    * @default Empty string
    *
    * @remark
    * Base itemTemplate for Controls/Selector/Lookup: "wml!Controls/Selector/Lookup/itemTemplate".
    * Base itemTemplate for Controls/Selector/Button: "wml!Controls/Selector/Button/itemTemplate".
    * If you reimplement contentTemplate / crossTemplate, you will not be notified of itemClick / crossClick events.
    * To work properly, you need to mark your content with classes: "js-controls-SelectedCollection__item__caption" / "js-controls-SelectedCollection__item__cross".
    *
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

   /**
    * @event Controls/interface/ISelectedCollection#itemsChanged Happens when changing the set of the selected collection.
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
});
