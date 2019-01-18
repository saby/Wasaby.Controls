define('Controls/Dropdown/interface/IFooterTemplate', [], function() {

   /**
    * Interface for dropdown lists that support the template for the footer.
    *
    * @interface Controls/Dropdown/interface/IFooterTemplate
    * @public
    * @author Золотова Э.Е.
    */

   /**
    * @name Controls/Dropdown/interface/IFooterTemplate#footerTemplate
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
    * </pre>
    */
});
