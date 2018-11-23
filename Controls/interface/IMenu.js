define('Controls/interface/IMenu', [], function() {

   /**
    * Interface for control Button/Menu.
    *
    * @interface Controls/interface/IMenu
    * @public
    * @author Золотова Э.Е.
    */

   /**
    * @name Controls/interface/IMenu#viewMode
    * @cfg {Enum} Button view mode.
    * @variant link Decorated hyperlink.
    * @variant button Default button.
    * @variant toolButton Toolbar button.
    * @default button
    * @example
    * Button with 'link' viewMode.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="primary" viewMode="link" size="xl"/>
    * </pre>
    * Button with 'toolButton' viewMode.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="danger" viewMode="toolButton"/>
    * </pre>
    * Button with 'button' viewMode.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="success" viewMode="button"/>
    * </pre>
    * @see Controls/Button#viewMode
    * @see size
    */

   /**
    * @name Controls/interface/IMenu#style
    * @cfg {Enum} Button display style.
    * @variant primary The display style of the attracting attention button.
    * @variant success The display style of the success button.
    * @variant warning The display style of the warning button.
    * @variant danger The display style of the danger button.
    * @variant info The display style of the simple information button.
    * @variant secondary The display style of the secondary button.
    * @variant default The display style of button as default text.
    * @default secondary
    * @example
    * Primary link button with 'primary' style.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="primary" viewMode="link" size="xl"/>
    * </pre>
    * Toolbar button with 'danger' style.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="danger" viewMode="toolButton"/>
    * </pre>
    * @see Controls/Button#style
    * @see size
    */

   /**
    * @name Controls/interface/IMenu#size
    * @cfg {String} Button size. The value is given by common size notations.
    * @variant s Small button size.
    * @variant m Medium button size.
    * @variant l Large button size.
    * @variant xl Extra large button size.
    * @default m
    * @remark
    * Button size is different for different button viewModes.
    * Sizes 's' and 'xl' don't supported by viewModes:
    * <ul>
    *     <li>button,</li>
    *     <li>toolButton</li>
    * </ul>
    * @example
    * 'L' size of primary button.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="primary" viewMode="button" size="l"/>
    * </pre>
    * Default size of primary button.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="primary" viewMode="button"/>
    * </pre>
    * Uncorrect size of primary button.
    * <pre>
    *    <Controls.Button.Menu caption="Send document" style="primary" viewMode="button" size="xl"/>
    * </pre>
    * @see Controls/Button#size
    * @see style
    */

   /**
    * @name Controls/interface/IMenu#icon
    * @cfg {String} Button icon.
    * @default Undefined
    * @remark  When you customize a button, use the icon style instead of the css-classes.
    * @example
    * Primary button with icon 'Add'.
    * <pre>
    *    <Controls.Button.Menu icon="icon-Add" style="primary" viewMode="button"/>
    * </pre>
    * @see Controls/Button#icon
    * @see iconStyle
    */

   /**
    * @name Controls/interface/IMenu#iconStyle
    * @cfg {Enum} Icon display style.
    * @variant primary The display style of the attracting attention icon.
    * @variant success The display style of the success icon.
    * @variant warning The display style of the warning icon.
    * @variant danger The display style of the danger icon.
    * @variant info The display style of the simple information icon.
    * @variant secondary The display style of the secondary icon.
    * @default secondary
    * @example
    * Primary button with default icon style.
    * <pre>
    *    <Controls.Button.Menu icon="icon-Add" style="primary" viewMode="button"/>
    * </pre>
    * Primary button with 'success' icon style.
    * <pre>
    *    <Controls.Button.Menu icon="icon-Add" iconStyle="success" style="primary" viewMode="button"/>
    * </pre>
    * @see Controls/Button#iconStyle
    * @see icon
    */

   /**
    * @name Controls/interface/IMenu#tooltip
    * @cfg {String} Tooltip text.
    * @example
    * Button menu with tooltip 'Create task'
    * <pre>
    *    <Controls.Button.Menu icon="icon-Add" caption="Create" tooltip="Create task"/>
    * </pre>
    * @see Controls/Button#iconStyle
    * @see icon
    */

   /**
    * @name Controls/interface/IMenu#caption
    * @cfg {String} Control caption text.
    * @example
    * Button menu with caption 'Create'.
    * <pre>
    *    <Controls.Button.Menu icon="icon-Add" caption="Create"/>
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *       keyProperty="id"
    *       source="{{_source}}" />
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory({
    *      idProperty: 'id',
    *      data: [
    *         {
    *            id: '1',
    *            title: 'Yaroslavl'
    *         },
    *         {
    *            id: '2',
    *            title: 'Moscow'
    *         },
    *         {
    *            id: '3',
    *            title: 'St-Petersburg'
    *         }
    *      ]
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#source
    * @cfg {WS.Data/Source/Base} Object that implements ISource interface for data access.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *       keyProperty="id"
    *       source="{{_source}}" />
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory({
    *      idProperty: 'id',
    *      data: [
    *         {
    *            id: '1',
    *            title: 'Yaroslavl'
    *         },
    *         {
    *            id: '2',
    *            title: 'Moscow'
    *         },
    *         {
    *            id: '3',
    *            title: 'St-Petersburg'
    *         }
    *      ]
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#filter
    * @cfg {Object} Filter configuration - object with field names and their values.
    * @example
    * In this example, 2 items will be displayed in the dropdown menu.
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *       keyProperty="id"
    *       filter={{_filter}}
    *       source="{{_source}}" />
    * </pre>
    * JS:
    * <pre>
    *    this._filter = {id: ['1, '2']};
    *    this._source = new Memory({
    *      idProperty: 'id',
    *      data: [
    *         {
    *            id: '1',
    *            title: 'Yaroslavl'
    *         },
    *         {
    *            id: '2',
    *            title: 'Moscow'
    *         },
    *         {
    *            id: '3',
    *            title: 'St-Petersburg'
    *         }
    *      ]
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#itemTemplate
    * @cfg {Function} Template for item render.
    * @default "wml!Controls/Dropdown/resources/template/itemTemplate"
    * @remark
    * To determine the template, you should call the base template "wml!Controls/Dropdown/resources/template/itemTemplate".
    * The template should be placed in the component using the <ws:partial> tag with the template attribute.
    * By default, the base template wml!Controls/Dropdown/resources/template/itemTemplate will display only the 'title' field. You can change the display of records by setting their values ​​for the following options:
    *    -  displayProperty - defines the display field (By default 'title'),
    *    -  marker - sets the display of the row marker,
    *    -  multiLine - sets the display record to several lines.
    * You can redefine content using the contentTemplate option.
    * @example
    * Menu with text header - "Add".
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *          keyProperty="id"
    *          icon="icon-medium icon-AddButtonNew"
    *          source="{{_source)}}"
    *          tooltip="Add">
    *       <ws:itemTemplate>
    *          <ws:partial
    *             template="wml!Controls/Dropdown/resources/template/itemTemplate" >
    *          <ws:contentTemplate>
    *             <div class="demo-combobox__item">
    *                <div class="demo-combobox__title">{{itemTemplate.itemData.item.get('title')}}</div>
    *                <div class="demo-combobox__comment">{{itemTemplate.itemData.item.get('comment')}}</div>
    *             </div>
    *          </ws:contentTemplate>
    *          </ws:partial>
    *       </ws:itemTemplate>
    *    </Controls.Button.Menu>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory ({
    *       data: [
    *           { id: 1,
    *             title: 'Discussion',
    *             comment: 'Create a discussion to find out the views of other group members on this issue' },
    *           { id: 2,
    *             title: 'Idea/suggestion',
    *             comment: 'Offer your idea, which others can not only discuss, but also evaluate.
    *             The best ideas will not go unnoticed and will be realized' },
    *           { id: 3,
    *             title: 'Problem',
    *             comment: 'Do you have a problem? Tell about it and experts will help to find its solution' }
    *       ],
    *       idProperty: 'id'
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#itemTemplateProperty
    * @cfg {Function} Template for item render.
    * @remark
    * To determine the template, you should call the base template "wml!Controls/Dropdown/resources/template/itemTemplate".
    * The template should be placed in the component using the <ws:partial> tag with the template attribute.
    * By default, the base template wml!Controls/Dropdown/resources/template/itemTemplate will display only the 'title' field. You can change the display of records by setting their values ​​for the following options:
    *    -  displayProperty - defines the display field (By default 'title'),
    *    -  marker - sets the display of the row marker,
    *    -  multiLine - sets the display record to several lines.
    * You can redefine content using the contentTemplate option.
    * @example
    * Second item in the menu will be displayed with comment.
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *          keyProperty="id"
    *          icon="icon-medium icon-AddButtonNew"
    *          source="{{_source)}}"
    *          itemTemplateProperty=""
    *          tooltip="Add"/>
    * </pre>
    * myItemTemplate.wml
    * <pre>
    *    <ws:partial template="wml!Controls/Dropdown/resources/template/itemTemplate" >
    *       <ws:contentTemplate>
    *          <div class="demo-combobox__item">
    *             <div class="demo-combobox__title">{{itemTemplate.itemData.item.get('title')}}</div>
    *             <div class="demo-combobox__comment">{{itemTemplate.itemData.item.get('comment')}}</div>
    *          </div>
    *       </ws:contentTemplate>
    *    </ws:partial>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory ({
    *       data: [
    *           { id: 1,
    *             title: 'Discussion' },
    *           { id: 2,
    *             title: 'Idea/suggestion',
    *             comment: 'Offer your idea, which others can not only discuss, but also evaluate.
    *             The best ideas will not go unnoticed and will be realized',
     *            myItemTemplate='myItemTemplate.wml' },
    *           { id: 3,
    *             title: 'Problem' }
    *       ],
    *       idProperty: 'id'
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#nodeProperty
    * @cfg {String} Name of the field describing the type of the node (list, node, hidden node).
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *       keyProperty="id"
    *       source="{{_source}}"
    *       nodeProperty="parent@"/>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory({
    *      idProperty: 'id',
    *      data: [
    *          { id: 1, title: 'Sales of goods and services', parent: null, 'parent@': true },
    *          { id: 2, title: 'Contract', parent: null, 'parent@': false },
    *          { id: 3, title: 'Texture', parent: null, 'parent@': false },
    *          { id: 4, title: 'Score', parent: null, 'parent@': false },
    *          { id: 5, title: 'Act of reconciliation', parent: null, 'parent@': false },
    *          { id: 6, title: 'Goods', parent: 1, 'parent@': false },
    *          { id: 7, title: 'Finished products', parent: 1, 'parent@': false }
    *      ]
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#parentProperty
    * @cfg {String} Name of the field that contains item's parent identifier.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *       keyProperty="id"
    *       source="{{_source}}"
    *       parentProperty="parent"
    *       nodeProperty="parent@"/>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory ({
    *       data: [
    *          { id: 1, title: 'Sales of goods and services', parent: null, 'parent@': true },
    *          { id: 2, title: 'Contract', parent: null, 'parent@': false },
    *          { id: 3, title: 'Texture', parent: null, 'parent@': false },
    *          { id: 4, title: 'Score', parent: null, 'parent@': false },
    *          { id: 5, title: 'Act of reconciliation', parent: null, 'parent@': false },
    *          { id: 6, title: 'Goods', parent: 1, 'parent@': false },
    *          { id: 7, title: 'Finished products', parent: 1, 'parent@': false }
    *       ],
    *       idProperty: 'id'
    *    )};
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#navigation
    * @cfg {Object} List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.)
    * @example
    * In this example, 2 items will be displayed in the dropdown menu.
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *       keyProperty="id"
    *       source="{{_source}}"
    *       navigation="{{_navigation}}"/>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory ({
    *       data: [
    *          { id: 1, title: 'Sales of goods and services' },
    *          { id: 2, title: 'Contract' },
    *          { id: 3, title: 'Texture' },
    *          { id: 4, title: 'Score' },
    *          { id: 5, title: 'Act of reconciliation' },
    *          { id: 6, title: 'Goods' },
    *          { id: 7, title: 'Finished products' }
    *       ],
    *       idProperty: 'id'
    *    )};
    *    this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
               pageSize: 2,
               page: 0,
               mode: 'totalCount'
            }
         };
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#headerTemplate
    * @cfg {Function | String} Template that will be rendered above the list.
    * @default "wml!Controls/Dropdown/resources/template/defaultHeadTemplate"
    * @remark
    * To determine the template, you should call the base template 'wml!Controls/Dropdown/resources/template/defaultHeadTemplate'.
    * The template should be placed in the component using the <ws:partial> tag with the template attribute.
    * By default, the base template 'wml!Controls/Dropdown/resources/template/defaultHeadTemplate' will display caption and icon, if they are set. You can change the following options:
    * <ul>
    *     <li>caption - header text,</li>
    *     <li>icon - header icon.</li>
    * </ul>
    * @example
    * Menu with text header - "Add".
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *          keyProperty="id"
    *          icon="icon-medium icon-AddButtonNew"
    *          source="{{_source)}}"
    *          tooltip="Add">
    *       <ws:headerTemplate>
    *          <ws:partial template="wml!Controls/Dropdown/resources/template/defaultHeadTemplate" caption="Add"/>
    *       </ws:headerTemplate>
    *    </Controls.Button.Menu>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory ({
    *       data: [
    *           { id: 1, title: 'Task in development' },
    *           { id: 2, title: 'Error in development' }
    *       ],
    *       idProperty: 'id'
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#footerTemplate
    * @cfg {Function | String} Template that will be rendered below the list.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *          keyProperty="id"
    *          icon="icon-Save icon-small"
    *          on:footerClick="footerClickHandler()"
    *          source="{{_source}}">
    *       <ws:footerTemplate>
    *          <div class="ControlsDemo-InputDropdown-footerTpl">
    *             <Controls.Button caption="+ New template" size="l" viewMode="link"/>
    *          </div>
    *       </ws:footerTemplate>
    *    </Controls.Button.Menu>
    * </pre>
    * JS:
    * <pre>
    *    footerClickHandler: function() {
    *       this._children.stack.open({
    *          opener: this._children.button
    *       });
    *    }
    * </ore>
    */

   /**
    * @name Controls/interface/IMenu#dropdownClassName
    * @cfg {String} Сlass for template.
    * @remark
    * The string, that is formed by the values from items, also changes position.
    * @example
    * Example menu with scrolling.
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *        keyProperty="id"
    *        icon="icon-small icon-Check"
    *        dropdownClassName="demo_menu"
    *        source="{{_source}}"/>
    * </pre>
    * CSS:
    * <pre>
    *    .demo_menu {
    *       max-height: 250px;
    *    }
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory({
    *    data: [
    *        { id: 1, title: 'Task in development' },
    *        { id: 2, title: 'Error in development' },
    *        { id: 3, title: 'Application' },
    *        { id: 4, title: 'Assignment' },
    *        { id: 5, title: 'Approval' },
    *        { id: 6, title: 'Working out' },
    *        { id: 7, title: 'Assignment for accounting' },
    *        { id: 8, title: 'Assignment for delivery' },
    *        { id: 9, title: 'Assignment for logisticians' }
    *    ],
    *    idProperty: 'id'
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#groupMethod
    * @cfg {Function} Function that returns group identifier.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *          keyProperty="id"
    *          icon="icon-small icon-AddButtonNew"
    *          source="{{_source}}"
    *          groupMethod="{{_groupMethod}}"/>
    * </pre>
    * JS:
    * <pre>
    *    this._groupMethod = function(item) {
    *        return item.get('group');
    *    }
    *    this._source = new Memory({
    *        data: [
    *                   { id: 1, title: 'Task in development', group: 'Select' },
    *                   { id: 2, title: 'Error in development', group: 'Select' },
    *                   { id: 3, title: 'Application', group: 'Select' },
    *                   { id: 4, title: 'Assignment', group: 'Create' },
    *                   { id: 5, title: 'Approval', group: 'Create' },
    *                   { id: 6, title: 'Working out', group: 'Create' },
    *                   { id: 7, title: 'Assignment for accounting', group: 'Create' },
    *                   { id: 8, title: 'Assignment for delivery', group: 'Create' },
    *                   { id: 9, title: 'Assignment for logisticians', group: 'Create' }
    *            ],
    *        idProperty: 'id'
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#groupTemplate
    * @cfg {Function | String} Group template.
    * @remark
    * To determine the template, you should call the base template "wml!Controls/Dropdown/resources/template/defaultGroupTemplate".
    * The template should be placed in the component using the <ws:partial> tag with the template attribute.
    * By default, the base template wml!Controls/Dropdown/resources/template/defaultGroupTemplate only displays a separator.  You can change the separator display by setting the option:
    *    -  showText - sets the display of the group name.
    * You can redefine content using the contentTemplate option.
    * The groupMethod option must also be set.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.Button.Menu
    *          keyProperty="id"
    *          icon="icon-small icon-AddButtonNew"
    *          groupMethod="{{_groupMethod}}"
    *          source="{{_source}}">
    *       <ws:groupTemplate>
    *          <ws:partial template="wml!Controls/Dropdown/resources/template/defaultGroupTemplate" showText="{{true}}" />
    *       </ws:groupTemplate>
    *    </Controls.Button.Menu>
    * </pre>
    * JS:
    * <pre>
    *    this._groupMethod = function(item) {
    *        return item.get('group');
    *    }
    *    this._source = new Memory({
    *        data: [
    *                   { id: 1, title: 'Task in development', group: 'Select' },
    *                   { id: 2, title: 'Error in development', group: 'Select' },
    *                   { id: 3, title: 'Application', group: 'Select' },
    *                   { id: 4, title: 'Assignment', group: 'Create' },
    *                   { id: 5, title: 'Approval', group: 'Create' },
    *                   { id: 6, title: 'Working out', group: 'Create' },
    *                   { id: 7, title: 'Assignment for accounting', group: 'Create' },
    *                   { id: 8, title: 'Assignment for delivery', group: 'Create' },
    *                   { id: 9, title: 'Assignment for logisticians', group: 'Create' }
    *            ],
    *        idProperty: 'id'
    * </pre>
    */
});
