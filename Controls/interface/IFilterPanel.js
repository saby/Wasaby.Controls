define('Controls/interface/IFilterPanel', [], function() {

   /**
    * Interface for filter panel
    *
    * @interface Controls/interface/IFilterPanel
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @typedef {Object} itemTpl
    * @property {String} templateName
    * @property {Object} templateOptions
    */

   /**
    * @typedef {Object} additionalTpl
    * @property {String} templateName
    * @property {Object} templateOptions
    */

   /**
    * @name Controls/interface/IFilterPanel#orientation
    * @cfg {String} Sets the orientation of panel in one of two directions.
    * @variant vertical Vertical orientation of the panel. The history block is displayed below.
    * @variant horizontal Horizontal orientation of the panel. History block is displayed on the right.
    * @default vertical
    * @remark
    * If a “horizontal” value is specified, but there is no history in the panel, the component will be displayed in one column.
    * @example
    * In this example panel will be displayed in two column.
    * <pre>
    *    <Controls.Filter.Button.Panel
    *          items={{_items}}
    *          orientation="horizontal"
    *          historyId="myHistoryId">
    *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
    *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    */

   /**
    * @name Controls/interface/IFilterPanel#headingCaption
    * @cfg {String} Text heading.
    * @default "Selected"
    * @example
    * In this example, the panel has the caption "Sales"
    * <pre>
    *    <Controls.Filter.Button.Panel
    *          items={{_items}}
    *          headingCaption="Sales">
    *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
    *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    * @see Controls/Heading#caption
    */

   /**
    * @name Controls/interface/IFilterPanel#headingStyle
    * @cfg {String} The heading style of the filter panel.
    * @variant primary Primary heading style.
    * @variant secondary Secondary heading style.
    * @default secondary
    * @example
    * In this example, the panel has a primary heading style.
    * <pre>
    *    <Controls.Filter.Button.Panel
    *          items={{_items}}
    *          headingStyle="primary">
    *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
    *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    * @see Controls/Heading#style
    */

   /**
    * @name Controls/interface/IFilterPanel#itemTemplate
    * @cfg {itemTpl} Template for item render.
    * @remark
    * To display in a string, that is formed by the values from items, you must make a bind:textValue="item.textValue".
    * For proper display, templates for all items should be described.
    * @example
    * Example of setting options itemTemplate
    * <pre>
    *    <Controls.Filter.Button.Panel items="{{_items}}">
    *       <ws:itemTemplate templateName="wml!Module/itemTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    *
    * Module/itemTemplate.wml
    * <pre>
    * <ws:template name="type">
    *    <Controls.Filter.Button.Panel.Dropdown
    *          bind:selectedKeys="item.value"
    *          bind:textValue="item.textValue"
    *          keyProperty="key"
    *          displayProperty="title"
    *          source="{{item.source}}" />
    * </ws:template>
    *
    * <ws:template name="deleted">
    *    <Controls.Filter.Button.Panel.Text
    *          bind:value="item.value"
    *          caption="{{item.textValue}}"/>/>
    * </ws:template>
    *
    * <ws:partial template="{{item.id}}" item="{{item}}"/>
    * </pre>
    *
    * JS:
    * <pre>
    *    this._items = [
    *       { id: 'type', value: ['1'], resetValue: ['1'], source: new MemorySource({
     *         data: [{ id: '1', title: 'All types' },
     *         { id: '2', title: 'Meeting' },
     *         { id: 3, title: 'Videoconference' }],
     *         idProperty: 'id'
     *       })},
    *       { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted' }
    *    ];
    * </pre>
    * @see itemTemplateProperty
    * @see <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
    */

   /**
    * @name Controls/interface/IFilterPanel#additionalTemplate
    * @cfg {additionalTpl} Template for item render in the additional block.
    * @remark
    * To display the filter in the additional block, you need to specify in the settings item visibility: false.
    * When specifying visibility = true, the filter will be displayed in the main block, but when the filter is reset, it will be displayed in the additional block.
    * @example
    * Example of setting options additionalTemplate
    * <pre>
    *    <Controls.Filter.Button.Panel items={{_items}}>
    *       <ws:itemTemplate templateName="wml!Module/itemTemplate"/>
    *       <ws:additionalTemplate templateName="wml!MyModule/additionalTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    *
    * Module/itemTemplate.wml
    * <pre>
    * <ws:template name="type">
    *    <Controls.Filter.Button.Panel.Dropdown
    *          bind:selectedKeys="item.value"
    *          bind:textValue="item.textValue"
    *          keyProperty="key"
    *          displayProperty="title"
    *          source="{{item.source}}" />
    * </ws:template>
    *
    * <ws:template name="deleted">
    *    <Controls.Filter.Button.Panel.Text
    *          bind:value="item.value"
    *          caption="{{item.textValue}}"/>/>
    * </ws:template>
    *
    * <ws:partial template="{{item.id}}" item="{{item}}"/>
    * </pre>
    *
    * MyModule/additionalTemplate.wml
    * <pre>
    *    <ws:template name="type">
    *       <Controls.Filter.Button.Panel.Dropdown
    *          bind:selectedKeys="item.value"
    *          keyProperty="key"
    *          displayProperty="title"
    *          source="{{item.source}}">
    *    </ws:template>
    *
    *    <ws:template name="deleted">
    *       <Controls.Filter.Button.Panel.Link caption="item.textValue"/>
    *    </ws:template>
    *
    *    <ws:partial template="{{item.id}}" item="{{item}}"/>
    * </pre>
    *
    * JS:
    * <pre>
    *    this._items = [
    *       { id: 'type', value: ['1'], resetValue: ['1'], visibility: true, source: new MemorySource({
    *         data: [{ id: '1', title: 'All types' },
    *         { id: '2', title: 'Meeting' },
    *         { id: 3, title: 'Videoconference' }],
    *         idProperty: 'id'
    *       })},
    *       { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted', visibility: false }
    *    ];
    * </pre>
    * @see additionalTemplateProperty
    * @see <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
    */

   /**
    * @name Controls/interface/IFilterPanel#additionalTemplateProperty
    * @cfg {additionalTpl} Name of the item property that contains template for item render in the additional block. If not set, additionalTemplate is used instead.
    * @remark
    * To display the filter in the additional block, you need to specify in the settings item visibility: false.
    * When specifying visibility = true, the filter will be displayed in the main block, but when the filter is reset, it will be displayed in the additional block.
    * @example
    * In this example, the template for the "deleted" filter in the additional block, will be loaded from the file MyModule/addTemplateDeleted.wml
    * <pre>
    *    <Controls.Filter.Button.Panel
    *       items={{_items}}
    *       additionalTemplateProperty="myAddTpl">
    *       <ws:itemTemplate templateName="wml!Module/itemTemplate"/>
    *       <ws:additionalTemplate templateName="wml!MyModule/additionalTemplate"/>
    *    </Controls.Filter.Button.Panel>
    * </pre>
    *
    * Module/itemTemplate.wml
    * <pre>
    * <ws:template name="type">
    *    <Controls.Filter.Button.Panel.Dropdown
    *          bind:selectedKeys="item.value"
    *          bind:textValue="item.textValue"
    *          keyProperty="key"
    *          displayProperty="title"
    *          source="{{item.source}}" />
    * </ws:template>
    *
    * <ws:template name="deleted">
    *    <Controls.Filter.Button.Panel.Text
    *          bind:value="item.value"
    *          caption="{{item.textValue}}"/>/>
    * </ws:template>
    *
    * <ws:partial template="{{item.id}}" item="{{item}}"/>
    * </pre>
    *
    * MyModule/additionalTemplate.wml
    * <pre>
    *    <ws:template name="type">
    *       <Controls.Filter.Button.Panel.Dropdown
    *          bind:selectedKeys="item.value"
    *          keyProperty="key"
    *          displayProperty="title"
    *          source="{{item.source}}">
    *    </ws:template>
    *
    *    <ws:partial template="{{item.id}}" item="{{item}}"/>
    * </pre>
    *
    * MyModule/addTemplateDeleted.wml
    * <pre>
    *     <Controls.Filter.Button.Panel.Link caption="item.textValue"/>
    * </pre>
    *
    * JS:
    * <pre>
    *    this._items = [
    *       { id: 'type', value: ['1'], resetValue: ['1'], visibility: true, source: new MemorySource({
    *         data: [{ id: '1', title: 'All types' },
    *         { id: '2', title: 'Meeting' },
    *         { id: 3, title: 'Videoconference' }],
    *         idProperty: 'id'
    *       })},
    *       { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted', visibility: false,
     *       myAddTpl="wml!MyModule/addTemplateDeleted"}
    *    ];
    * </pre>
    * @see additionalTemplate
    * @see <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
    */

   /**
    * @name Controls/interface/IFilterPanel#itemTemplateProperty
    * @cfg {additionalTpl} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    * @remark
    * To display in a string, that is formed by the values from items, you must make a bind:textValue="item.textValue".
    * For proper display, templates for all items should be described.
    * @example
    * In this example, the template for the "type" filter in the main block, will be loaded from the file Module/myTemplateForType.wml
    * TMPL:
    * <pre>
    *    <Controls.Filter.Button.Panel
    *    items={{_items}}
    *    itemTemplateProperty="myTpl"/>
    *    <ws:itemTemplate templateName="wml!Module/itemTemplate"/>
    * </pre>
    *
    * Module/itemTemplate.wml
    * <pre>
    *    <ws:template name="deleted">
    *       <Controls.Filter.Button.Panel.Text
    *             bind:value="item.value"
    *             caption="{{item.textValue}}"/>/>
    *    </ws:template>
    *
    *    <ws:partial template="{{item.id}}" item="{{item}}"/>
    * </pre>
    *
    * Module/myTemplateForType.wml
    * <pre>
    *    <Controls.Filter.Button.Panel.Dropdown
    *          bind:selectedKeys="item.value"
    *          bind:textValue="item.textValue"
    *          keyProperty="key"
    *          displayProperty="title"
    *          source="{{item.source}}" />
    * </pre>
    *
    * JS:
    * <pre>
    *    this._items = [
    *       { id: 'type', value: ['0'], resetValue: ['0'], myTpl: 'wml!Module/myTemplateForType' },
    *       { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted' }
    *    ];
    * </pre>
    * @see itemTemplate
    * @see <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
    */

   /**
    * @name Controls/interface/IFilterPanel#historyId
    * @cfg {String} Unique id for save history.
    * @remark For the correct work of the history mechanism, you need to configure the items property on the control by the <a href='/doc/platform/developmentapl/interface-development/ws4/components/filter-search/'>instruction</a>.
    */

});
