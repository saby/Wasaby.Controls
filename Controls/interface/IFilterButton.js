define('Controls/interface/IFilterButton', [
], function() {

   /**
    * Provides a user interface for browsing and editing the filter fields.
    * @interface Controls/interface/IFilterButton
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @typedef {Boolean} Visibility
    * @variant true The filter editor is located in the main block.
    * @variant false The filter editor is located in the additional block.
    */

   /**
    * @typedef {Object} FilterPanelItems
    * @property {String} id Name of filter field
    * @property {*} value Current filter field value
    * @property {*} resetValue Value for reset
    * @property {String} textValue Text value of filter field.  Used to display a textual representation of the filter
    * @property {Visibility} visibility Defines in which block the filter editor is located. For filter editors that are never displayed in the "You can still select" section, you do not need to specify.
    */

   /**
    * @name Controls/interface/IFilterButton#items
    * @cfg {FilterPanelItems[]} Special structure for the visual representation of the filter.
    * @remark
    * The "value" from every item will insert in filter by "id" of this item.
    * If visibility is not specified, the filter item will always be displayed in the main block.
    * @example
    * Example setting option "items" for two filters.
    * The first filter will be displayed in the main block "Selected"
    * The second filter will be displayed in the "Possible selected" block, because the property is set for it visibility = false.
    * TMPL:
    * <pre>
    *    <Controls.Filter.Button
    *       items={{_items}}
    *       templateName="wml!MyModule/panelTemplate"/>
    * </pre>
    *
    * MyModule/panelTemplate.wml
    * <pre>
    *    <Controls.Filter.Button.Panel>
    *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
    *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    *
    * JS:
    * <pre>
    *    this._items = [
    *       { id: 'type', value: ['1'], resetValue: ['1'] },
    *       { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted', visibility: false }
    *    ];
    * </pre>
    * @see <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
    */

   /**
    * @name Controls/interface/IFilterButton#lineSpaceTemplate
    * @cfg {Function} Template for the space between the button and the string, that is formed by the values from items.
    * @remark
    * For example, here you can place a period selection control.
    * @example
    * Example of inserting a quick period selection
    * <pre>
    *    <Controls.Filter.Button
    *       templateName="wml!MyModule/panelTemplate"
    *       items="{{_items}}">
    *       <ws:lineSpaceTemplate>
    *          <Controls.Input.Date.RangeLinkLite
    *             startValue="{{_startValue}}"
    *             endValue="{{_endValue}}"/>
    *       </ws:lineSpaceTemplate>
    *    </Controls.Filter.Button>
    * </pre>
    * @see Controls/Input/Date/RangeLinkLite
    */

   /**
    * @name Controls/interface/IFilterButton#templateName
    * @cfg {String} Template for the pop-up panel, that opens after clicking on the button.
    * @remark
    * As a template, it is recommended to use the control {@link Controls/Filter/Button/Panel }
    * The description of setting up the filter panel you can read <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>here</a>.
    * Important: for lazy loading template in the option give the path to the control
    * @example
    * Example setting options for two filters.
    * Templates for displaying both filters in the main block are in "MyModule/mainBlockTemplate.wml"
    * Templates for displaying second filter in the additional block are in "MyModule/additionalBlockTemplate.wml"
    * TMPL:
    * <pre>
    *    <Controls.Filter.Button
    *       items={{_items}}
    *       templateName="wml!MyModule/panelTemplate"/>
    * </pre>
    *
    * MyModule/panelTemplate.wml
    * <pre>
    *    <Controls.Filter.Button.Panel>
    *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
    *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    *
    * JS:
    * <pre>
    *    this._items = [
    *       { id: 'type', value: ['1'], resetValue: ['1'] },
    *       { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted', visibility: false }
    *    ];
    * </pre>
    * @see <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
    * @see Controls/Filter/Button/Panel
    */

   /**
    * @name Controls/interface/IFilterButton#alignment
    * @cfg {String} Sets the direction in which the popup panel will open.
    * @variant right The button is attached to the right edge, the pop-up panel opens to the left.
    * @variant left The button is attached to the left edge, the pop-up panel opens to the right.
    * @default right
    * @remark
    * The string, that is formed by the values from items, also changes position.
    * @example
    * Example of opening the filter panel in the right
    * <pre>
    *    <Controls.Filter.Button
    *       templateName="wml!MyModule/panelTemplate"
    *       items="{{_items}}"
    *       alignment="left" />
    * </pre>
    */

   /**
    * @event Controls/interface/IFilterButton#filterChanged Happens when filter changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Object} filter New filter.
    */

   /**
    * @event Controls/interface/IFilterButton#itemsChanged Happens when items changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Object} items New items.
    */

});
