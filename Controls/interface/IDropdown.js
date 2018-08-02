define('Controls/interface/IDropdown', [], function() {

   /**
    * Interface for dropdown lists.
    *
    * @interface Controls/interface/IDropdown
    * @public
    */

   /**
    * @name Controls/interface/IDropdown#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    */

   /**
    * @name Controls/interface/IDropdown#itemTemplate
    * @cfg {Function} Template for item render.
    */

   /**
    * @name Controls/interface/IDropdown#contentTemplate
    * @cfg {Function} Template for item's contents render.
    */

   /**
    * @name Controls/interface/IDropdown#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    */

});
