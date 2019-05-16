

   /**
    * Interface for dropdown lists that support the template for the footer.
    *
    * @interface Controls/_dropdown/interface/IFooterTemplate
    * @public
    * @author Золотова Э.Е.
    */

   /**
    * @name Controls/_dropdown/interface/IFooterTemplate#footerTemplate
    * @cfg {Function | String} Template that will be rendered below the list.
    * @example
    * TMPL:
    * <pre>
    *    <Controls.dropdown:Menu
    *          keyProperty="id"
    *          icon="icon-Save icon-small"
    *          on:footerClick="footerClickHandler()"
    *          source="{{_source}}">
    *       <ws:footerTemplate>
    *          <div class="ControlsDemo-InputDropdown-footerTpl">
    *             <Controls.Button caption="+ New template" size="l" viewMode="link"/>
    *          </div>
    *       </ws:footerTemplate>
    *    </Controls.dropdown:Menu>
    * </pre>
    * JS:
    * <pre>
    *    footerClickHandler: function() {
    *       this._children.stack.open({
    *          opener: this._children.button
    *       });
    *    }
    * </pre>
    */

