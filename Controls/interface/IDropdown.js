define('Controls/interface/IDropdown', [], function() {

   /**
    * Interface for dropdown lists.
    *
    * @interface Controls/interface/IDropdown
    * @public
    * @author Золотова Э.Е.
    */

   /**
    * @name Controls/interface/IDropdown#nodeProperty
    * @cfg {String} Name of the field describing the type of the node (list, node, hidden node).
    */

   /**
    * @name Controls/interface/IDropdown#parentProperty
    * @cfg {String} Name of the field that contains item's parent identifier.
    */

   /**
    * @name Controls/interface/IDropdown#headTemplate
    * @cfg {Function} Template that will be rendered above the list.
    */

   /**
    * @name Controls/interface/IDropdown#footerTemplate
    * @cfg {Function} Template that will be rendered below the list.
    */

   /**
    * @name Controls/interface/IDropdown#selectedKeys
    * @cfg {Array} Array of selected items' keys.
    */

   /**
    * @name Controls/interface/IDropdown#showHeader
    * @cfg {Boolean} Indicates whether folders should be displayed.
    */

   /**
    * @name Controls/interface/IDropdown#popupClassName
    * @cfg {Boolean} Class for drop-down list.
    */

});
