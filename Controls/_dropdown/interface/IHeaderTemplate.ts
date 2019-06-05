

   /**
    * Interface for dropdown lists that support the template for the header.
    *
    * @interface Controls/_dropdown/interface/IHeaderTemplate
    * @public
    * @author Золотова Э.Е.
    */

   /**
    * @name Controls/_dropdown/interface/IHeaderTemplate#headerTemplate
    * @cfg {Function | String} Template that will be rendered above the list.
    * @default "Controls/dropdownPopup:Template"
    * @remark
    * To determine the template, you should call the base template 'Controls/dropdownPopup:Template'.
    * The template should be placed in the component using the <ws:partial> tag with the template attribute.
    * By default, the base template 'Controls/dropdownPopup:Template' will display caption and icon, if they are set. You can change the following options:
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
    *          <ws:partial template="Controls/dropdownPopup:Template" caption="Add"/>
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

