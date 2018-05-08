define('Controls/Input/interface/ISuggest', [
], function() {

   /**
    * Interface for Input.Suggest.
    *
    * @mixin Controls/Input/interface/ISuggest
    * @public
    */

   /**
    * @name Controls/Input/interface/ISuggest#suggestTemplate
    * @cfg {Function} Primary suggest template (showing search results).
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
    * @event Controls/Input/interface/ISuggest#choose Occurs when user selects item from suggest.
    * @param {String} value Selected value.
    */
});
