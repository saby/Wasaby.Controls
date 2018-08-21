define('Controls/interface/IPropertyGrid', [
], function() {
   
   /**
    * Provides a user interface for browsing and editing the properties of an object.
    * @interface Controls/interface/IPropertyGrid
    * @public
    */
   
   /**
    * @typedef {Object} PropertyGridItems
    * @property {*} value Current property value.
    * @property {*} resetValue Property value for reset.
    */
   
   /**
    * @name Controls/interface/IPropertyGrid#items
    * @cfg {PropertyGridItems} Properties for editing or showing.
    */
   
});
