

      /**
       * Interface for controls with  implementing item grouping.
       *
       * @interface Controls/_dropdown/interface/IGroupped
       * @public
       * @author Золотова Э.Е.
       */

      /**
       * @name Controls/_dropdown/interface/IGroupped#groupingKeyCallback
       * @cfg {Function} Function that returns group identifier.
       * @example
       * TMPL:
       * <pre>
       *    <Controls.dropdown:Menu
       *          keyProperty="id"
       *          icon="icon-small icon-AddButtonNew"
       *          source="{{_source}}"
       *          groupingKeyCallback="{{_groupingKeyCallback}}"/>
       * </pre>
       * JS:
       * <pre>
       *    this._groupingKeyCallback = function(item) {
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
       * @name Controls/_dropdown/interface/IGroupped#groupTemplate
       * @cfg {Function | String} Group template.
       * @remark
       * To determine the template, you should call the base template "wml!Controls/Dropdown/resources/template/defaultGroupTemplate".
       * The template should be placed in the component using the <ws:partial> tag with the template attribute.
       * By default, the base template wml!Controls/Dropdown/resources/template/defaultGroupTemplate only displays a separator.  You can change the separator display by setting the option:
       *    -  showText - sets the display of the group name.
       * You can redefine content using the contentTemplate option.
       * The groupingKeyCallback option must also be set.
       * @example
       * TMPL:
       * <pre>
       *    <Controls.dropdown:Menu
       *          keyProperty="id"
       *          icon="icon-small icon-AddButtonNew"
       *          groupingKeyCallback="{{_groupingKeyCallback}}"
       *          source="{{_source}}">
       *       <ws:groupTemplate>
       *          <ws:partial template="wml!Controls/Dropdown/resources/template/defaultGroupTemplate" showText="{{true}}" />
       *       </ws:groupTemplate>
       *    </Controls.dropdown:Menu>
       * </pre>
       * JS:
       * <pre>
       *    this._groupingKeyCallback = function(item) {
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
   
