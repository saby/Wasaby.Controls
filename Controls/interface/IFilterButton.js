define('Controls/interface/IFilterButton', [
], function() {
   
   /**
    * Provides a user interface for browsing and editing the filter fields.
    * @interface Controls/interface/IFilterButton
    * @public
    */
   
   /**
    * @typedef {Object} FilterPanelItems
    * @property {String} id Name of filter field
    * @property {*} value Current filter field value
    * @property {*} resetValue Value for reset
    * @property {String} textValue Text value of filter field.  Used to display a textual representation of the filter
    * @property {Boolean} visibilityValue Determines whether the filter editor is visible
    */
   
   /**
    * @name Controls/interface/IFilterButton#items
    * @cfg {FilterPanelItems[]} Properties for editing or showing.
    */
   
   /**
    * @name Controls/interface/IFilterButton#filterMode
    * @cfg {String} Mode of forming a filter.
    * @variant onlyChanges - only changed fields
    * @variant full - all fields
    */
   
   /**
    * @name Controls/interface/IFilterButton#lineSpaceTemplate
    * @cfg {Function} Template for the space between the filter button and the string.
    */
   
   /**
    * @name Controls/interface/IFilterButton#template
    * @cfg {String} Template for the pop-up panel. The description of the filter panel options: (@link Controls/interface/IFilterPanel).
    */
   
   /**
    * @name Controls/interface/IFilterButton#orientation
    * @cfg {String} Sets the direction in which the popup panel will open.
    * @variant right The panel opens to the left.
    * @variant left The panel opens to the right.
    */
   
});
