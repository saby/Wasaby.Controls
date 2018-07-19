define('Controls/interface/IDropdown', [], function() {

   /**
    * Interface for dropdown lists.
    *
    * @interface Controls/interface/IDropdown
    * @public
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.headerConfig
    * @cfg {Object} Configuration for folder render.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.parentProperty
    * @cfg {String} Name of the field that contains item's parent identifier.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.nodeProperty
    * @cfg {String} Name of the item property that identifies item type (list, node, hidden node).
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.itemTemplate
    * @cfg {Function} Template for item render.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.headTemplate
    * @cfg {Function} Template for folder render.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.contentTemplate
    * @cfg {Function} Template for item's contents render.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.footerTemplate
    * @cfg {Function} Footer template.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.showHeader
    * @cfg {Boolean} Indicates whether folders should be displayed.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.selectedKeys
    * @cfg {String|Array} Selected items' keys.
    */

});
