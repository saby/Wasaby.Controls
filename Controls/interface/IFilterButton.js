define('Controls/interface/IFilterButton', [
], function() {
   
   /**
    * Provides a user interface for browsing and editing the filter fields.
    * @mixin Controls/interface/IFilterButton
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
    * @typedef {String} panelStyle
    * @variant default one column panel
    * @variant column two or more column panel
    */
   
   /**
    * @typedef {Object} panelProps
    * @property {String} title Filter panel title
    * @property {Function} topSpaceTemplate Template between title and panel buttons in panel header.
    * @property {panelStyle} style
    */
   
   /**
    * @typedef {Object} itemTpl
    * @property {String} templateName
    * @property {Object} templateOptions
    */
   
   /**
    * @typedef {Object} additionalTpl
    * @property {String} templateName
    * @property {Object} templateOptions
    */
   
   /**
    * @name Controls/interface/IFilterButton#items
    * @cfg {FilterPanelItems[]} Properties for editing or showing.
    */
   
   /**
    * @name Controls/interface/IFilterButton#orientation
    * @cfg {String} orientation of filter button.
    * @variant right
    * @variant left
    */
   
   /**
    * @name Controls/interface/IFilterButton#filterMode
    * @cfg {String} Mode of forming a filter.
    * @variant onlyChanges - only changed fields
    * @variant full - all fields
    */
   
   /**
    * @name Controls/interface/IFilterButton#lineSpaceTemplate
    * @cfg {Function} template for the space between the filter button and the string.
    */
   
   /**
    * @name Controls/interface/IFilterButton#panelProperties
    * @cfg {panelProps} options for filter panel
    */
   
   /**
    * @name Controls/interface/IFilterButton#itemTemplate
    * @cfg {itemTpl} Template for item render
    */
   
   /**
    * @name Controls/interface/IFilterButton#additionalTemplate
    * @cfg {additionalTpl} Template for item render in block "Possible to select"
    */
   
   /**
    * @name Controls/interface/IFilterButton#additionalTemplateProperty
    * @cfg {additionalTpl} Name of the item property that contains template for item render in block "Possible to select . If not set, additionalTemplate is used instead.
    */
   
   /**
    * @name Controls/interface/IFilterButton#itemTemplateProperty
    * @cfg {additionalTpl} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    */
   
   /**
    * @name Controls/interface/IFilterButton#historyId
    * @cfg {String} Unique id for save history.
    * @remark For the correct work of the history, you need to configure the structure of the application by the instruction https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ws4/components/filter-search/
    */
   
});
