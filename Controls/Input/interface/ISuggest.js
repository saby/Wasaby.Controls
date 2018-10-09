define('Controls/Input/interface/ISuggest', [
], function() {

   /**
    * Interface for Input.Suggest.
    *
    * @interface Controls/Input/interface/ISuggest
    * @public
    */
   
   /**
    * @typedef {Object} suggestTemplateProp
    * @property {String} templateName component name, that will be displayed in suggest.
    * @property {String} templateOptions options for component, that will be displayed in suggest.
    */

   /**
    * @name Controls/Input/interface/ISuggest#suggestTemplate
    * @cfg {suggestTemplateProp} Primary suggest template (showing search results).
    */
   
   /**
    * @name Controls/Input/interface/ISuggest#emptyTemplate
    * @cfg {Function} Template that's rendered when no result were found.
    * @remark If option isn't set, empty suggest won't appear.
    */

   /**
    * @name Controls/Input/interface/ISuggest#suggestFooterTemplate
    * @cfg {Function} Footer template ('show all' button).
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
