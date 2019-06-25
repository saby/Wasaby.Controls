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
    * @name Controls/interface/ISelectedCollection#itemTemplate
    * @cfg {Function|String} Selected item template.
    * @remark
    * Base itemTemplate for Controls/lookup:Input: "wml!Controls.lookup:ItemTemplate".
    * Base itemTemplate for Controls.lookup:Selector: "wml!Controls.lookup:ButtonItemTemplate".
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
    *    <Controls.lookup:Selector
    *          source="{{_source}}"
    *          keyProperty="id">
    *       <ws:itemTemplate>
    *          <ws:partial template="wml!Controls.lookup:ButtonItemTemplate"
    *                      style="primary"
    *                      size="xl"
    *                      displayProperty="title"
    *                      clickable="{{true}}"/>
    *       </ws:itemTemplate>
    *    </Controls.lookup:Selector>
    * </pre>
    */

   /**
    * Open stack popup.
    * @function Controls/interface/ISelectedCollection#showSelector
    * @returns {Promise}
    * @param {PopupOptions[]} popupOptions Stack popup options.
    * @example
    * Open stack with specified configuration.
    * wml
    * <pre>
    *     <Controls.lookup:Input
    *           name="directoriesLookup"
    *           bind:selectedKeys="_selectedKeysDirectories"
    *           source="{{_source}}"
    *           searchParam="title"
    *           keyProperty="id">
    *        <ws:placeholder>
    *           Specify the
    *           <Controls.lookup:Link caption="department" on:click="showSelector('department')"/>
    *           and
    *           <Controls.lookup:Link caption="company" on:click="showSelector('company')"/>
    *        </ws:placeholder>
    *        <ws:selectorTemplate templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
    *        <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
    *     </Controls.lookup:Input>
    * </pre>
    * js
    * <pre>
    *     Control.extend({
    *        ...
    *
    *        showSelector: function(selectedTab) {
    *            this._children.directoriesLookup.showSelector({
    *                templateOptions: {
    *                   selectedTab: selectedTab
    *                }
    *            });
    *        }
    *
    *        ...
    *
    *     });
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
    *    <Controls.lookup:Selector
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:textValueChanged="onTextValueChanged()"
    *    </Controls.lookup:Selector>
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
    *    <Controls.lookup:Selector
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:itemsChanged="onItemsChanged()"
    *    </Controls.lookup:Selector>
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

   /**
    * @event Controls/interface/ISelectedCollection#selectorCallback Occurs when selected items with selector.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {RecordSet} currentItems Current list of items in Lookup.
    * @param {RecordSet} newItems List of items selected from selector.
    */

   /**
    * @event Controls/interface/ISelectedCollection#openInfoBox Occurs before opening a pop-up with all selected entries
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Object} config Config on which popup will be built.
    * @example
    * The following example creates Controls/lookup:Input and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       keyProperty="id"
    *       searchParam="title"
    *       on:openInfoBox="_openInfoBox()"
    *    </Controls.lookup:Input>
    * </pre>
    * JS:
    * <pre>
    *    _openInfoBox: function(e, config) {
    *       config.maxWidth = 500;
    *       config.templateOptions.items = new collection.List({
    *          items: Chain(config.templateOptions.items).sort(function() {
    *             ...
    *          }).value()
    *       })
    *    }
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#closeInfoBox Occurs when closing a pop-up with all selected entries.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    */

   /**
    * @event Controls/interface/ISelectedCollection#showSelector Occurs before opening the selector through the interface.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {PopupOptions[]} popupOptions Stack popup options.
    * @example
    * The following example creates Controls/lookup:Input and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       keyProperty="id"
    *       searchParam="title"
    *       on:showSelector="_showSelectorHandler()"
    *    </Controls.lookup:Input>
    * </pre>
    * JS:
    * <pre>
    *    _loadParams: function() {
    *       ...
    *    },
    *
    *    _showSelectorHandler: function(e, popupOptions) {
    *       var self = this;
    *
    *       this._loadParams(popupOptions).addCallback(function(newPopupOptions) {
    *          self.showSelector(newPopupOptions);
    *       });
    *
    *       // cancel the opening of the selector
    *       return false;
    *    }
    * </pre>
    */

   /**
    * @typedef {Object} PopupOptions
    * @description Stack popup options.
    * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
    * @property {Boolean} modal Determines whether the window is modal.
    * @property {String} className Class names of popup.
    * @property {Boolean} closeOnOutsideClick Determines whether possibility of closing the popup when clicking past.
    * @property {function|String} template Template inside popup.
    * @property {function|String} templateOptions Template options inside popup.
    * @property {Number} minWidth The minimum width of popup.
    * @property {Number} maxWidth The maximum width of popup.
    * @property {Number} width Width of popup.
    */
});
