define('Controls/interface/IMenu', [], function() {

   /**
    * Interface for control Button/Menu.
    *
    * @interface Controls/interface/IMenu
    * @public
    * @author Золотова Э.Е.
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
    *       data: [
    *           { id: 1, title: 'Task in development' },
    *           { id: 2, title: 'Error in development' },
    *           { id: 3, title: 'Application' },
    *           { id: 4, title: 'Assignment' },
    *           { id: 5, title: 'Approval' },
    *           { id: 6, title: 'Working out' },
    *           { id: 7, title: 'Assignment for accounting' },
    *           { id: 8, title: 'Assignment for delivery' },
    *           { id: 9, title: 'Assignment for logisticians' }
    *       ],
    *       idProperty: 'id'
    *    });
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
    *     });
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
    *    });
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
});
