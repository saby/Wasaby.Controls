define('Controls/Input/interface/ISuggest', [
], function() {

   /**
    * Interface for Input.Suggest.
    *
    * @interface Controls/Input/interface/ISuggest
    * @public
    * @author Герасимов А.М.
    */
   
   /**
    * @typedef {Object} suggestTemplateProp
    * @property {String} templateName component name, that will be displayed in suggest.
    * @property {String} templateOptions options for component, that will be displayed in suggest.
    */

   /**
    * @name Controls/Input/interface/ISuggest#suggestTemplate
    * @cfg {suggestTemplateProp} Primary suggest template (showing search results).
    * @example
    * suggestTemplate.wml
    * <pre>
    *    <Controls.Container.Suggest.List>
    *       <Controls.List keyProperty="id">
    *          <ws:itemTemplate>
    *             <ws:partial template="wml!Controls/List/ItemTemplate" displayProperty="city"/>
    *          </ws:itemTemplate>
    *       </Controls.List>
    *    </Controls.Container.Suggest.List>
    * </pre>
    *
    * component with Input/Suggest:
    * <pre>
    *    <Controls.Input.Suggest>
    *       <ws:suggestTemplate templateName="wml!SuggestTemplate">
    *          <ws:templateOptions />
    *       </ws:suggestTemplate>
    *    </Controls.Input.Suggest>
    * </pre>
    */
   
   /**
    * @name Controls/Input/interface/ISuggest#emptyTemplate
    * @cfg {Function} Template that's rendered when no result were found.
    * @remark If option isn't set, empty suggest won't appear.
    * @example
    * emptyTemplate.wml:
    * <pre>
    *    <div class="emptyTemplate-class">Sorry, no data today</div>
    * </pre>
    *
    * MySuggest.wml:
    * <Controls.Input.Suggest emptyTemplate="wml!emptyTemplate">
    * </Controls.Input.Suggest>
    */
   
   /**
    * @typedef {Object} suggestFooterTemplate
    * @property {String} [templateName] name of the template that will be showed in footer.
    * @property {Object} [templateOptions] options for the footerTemplate
    * @property {String} [direction] Направление просмотра индекса по умолчанию (при первом запросе):
    */
   
   /**
    * @name Controls/Input/interface/ISuggest#suggestFooterTemplate
    * @cfg {suggestFooterTemplate} Footer template ('show all' button).
    * @example
    * myFooter.wml
    * <pre>
    *    <span on:click="_showTasksClick()">show tasks</span>
    * <pre>
    *
    * myFooter.js
    * <pre>
    *    define('myFooter', ['Core/Control'], function(Control) {
    *       return Control.extend({
    *          _showTasksClick: function() {
    *             stackOpener.open();
    *          }
    *       });
    *    });
    * </pre>
    *
    * mySuggest.wml
    * <pre>
    *    <Controls.Input.Suggest>
    *       <ws:suggestFooterTemplate templateName="myFooter">
    *    </Controls.Input.Suggest>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/ISuggest#historyId
    * @cfg {String} Unique id to save input history.
    */

   /**
    * @name Controls/Input/interface/ISuggest#autoDropDown
    * @cfg {Boolean} show dropDown when the input get focused.
    */
   
   /**
    * @name Controls/Input/interface/ISuggest#displayProperty
    * @cfg {String} Defines which field from suggest list will be used as text after selecting an option.
    * @remark
    * @example
    * <pre>
    *    <Controls.Input.Suggest displayProperty="name"/>
    * </pre>
    */

   /**
    * @event Controls/Input/interface/ISuggest#choose Occurs when user selects item from suggest.
    * @param {String} value Selected value.
    */
});
