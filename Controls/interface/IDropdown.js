define('Controls/interface/IDropdown', [], function() {

   /**
    * Interface for dropdown lists.
    *
    * @interface Controls/interface/IDropdown
    * @public
    * @author Золотова Э.Е.
    */

   /**
    * @name Controls/interface/IDropdown#itemTemplate
    * @cfg {Function} Template for item render.
    * @default "Controls/dropdown:ItemTemplate"
    * @remark
    * To determine the template, you should call the base template "Controls/dropdown:ItemTemplate".
    * The template should be placed in the component using the <ws:partial> tag with the template attribute.
    * By default, the base template Controls/dropdown:ItemTemplate will display only the 'title' field. You can change the display of records by setting their values for the following options:
    *    -  displayProperty - defines the display field (By default 'title'),
    *    -  marker - sets the display of the row marker,
    *    -  multiLine - sets the display record to several lines.
    * You can redefine content using the contentTemplate option.
    * @example
    * Menu with text header - "Add".
    * TMPL:
    * <pre>
    *    <Controls.dropdown:Button
    *          keyProperty="id"
    *          icon="icon-medium icon-AddButtonNew"
    *          source="{{_source)}}"
    *          tooltip="Add">
    *       <ws:itemTemplate>
    *          <ws:partial
    *             template="Controls/dropdown:ItemTemplate"
    *             itemData="{{itemData}}"
    *             multiLine="{{true}}">
    *          <ws:contentTemplate>
    *             <div class="demo-menu__item">
    *                <div class="demo-title">{{itemTemplate.itemData.item.get('title')}}</div>
    *                <div class="demo-comment">{{itemTemplate.itemData.item.get('comment')}}</div>
    *             </div>
    *          </ws:contentTemplate>
    *          </ws:partial>
    *       </ws:itemTemplate>
    *    </Controls.dropdown:Button>
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
    * @name Controls/interface/IDropdown#itemTemplateProperty
    * @cfg {Function} Name of the item property that contains template for item render.
    * @remark
    * To determine the template, you should call the base template "Controls/dropdown:ItemTemplate".
    * The template should be placed in the component using the <ws:partial> tag with the template attribute.
    * By default, the base template Controls/dropdown:ItemTemplate will display only the 'title' field. You can change the display of records by setting their values for the following options:
    *    -  displayProperty - defines the display field (By default 'title'),
    *    -  marker - sets the display of the row marker,
    *    -  multiLine - sets the display record to several lines.
    * You can redefine content using the contentTemplate option.
    * @example
    * Second item in the menu will be displayed with comment.
    * TMPL:
    * <pre>
    *    <Controls.dropdown:Button
    *          keyProperty="id"
    *          icon="icon-medium icon-AddButtonNew"
    *          source="{{_source)}}"
    *          itemTemplateProperty=""
    *          tooltip="Add"/>
    * </pre>
    * myItemTemplate.wml
    * <pre>
    *    <ws:partial template="Controls/dropdown:ItemTemplate"
    *                itemData="{{itemData}}">
    *       <ws:contentTemplate>
    *          <div class="demo-item">
    *             <div class="demo-title">{{itemTemplate.itemData.item.get('title')}}</div>
    *             <div class="demo-comment">{{itemTemplate.itemData.item.get('comment')}}</div>
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
    * @name Controls/interface/IDropdown#dropdownClassName
    * @cfg {String} The class that hangs on dropdown list.
    * @remark
    * The string, that is formed by the values from items, also changes position.
    * @example
    * Example menu with scrolling.
    * TMPL:
    * <pre>
    *    <Controls.dropdown:Button
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
    * @name Controls/interface/IDropdown#historyId
    * @cfg {String} Unique id for save history.
    */

});
