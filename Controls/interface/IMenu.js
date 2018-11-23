define('Controls/interface/IMenu', [], function() {

   /**
    * Interface for control Button/Menu.
    *
    * @interface Controls/interface/IMenu
    * @public
    * @author Золотова Э.Е.
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
    *            city: 'Yaroslavl'
    *         },
    *         {
    *            id: '2',
    *            city: 'Moscow'
    *         },
    *         {
    *            id: '3',
    *            city: 'St-Petersburg'
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
    *         {
    *            id: '1',
    *            city: 'Yaroslavl',
    *            'parent@': true
    *         },
    *         {
    *            id: '2',
    *            city: 'Moscow',
    *            'parent@': true
    *         },
    *         {
    *            id: '3',
    *            city: 'St-Petersburg',
    *            'parent@': false
    *         }
    *      ]
    *    });
    * </pre>
    */

   /**
    * @name Controls/interface/IMenu#parentProperty
    * @cfg {String} Name of the field that contains item's parent identifier.
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
    *
    */
});
