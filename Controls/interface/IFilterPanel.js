define('Controls/interface/IFilterPanel', [
], function() {

   /**
    * Interface for filter panel
    *
    * @mixin Controls/interface/IFilterPanel
    * @public
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
    * @name Controls/interface/IFilterPanel#panelStyle
    * @cfg (String) Sets the display of the filter panel.
    * @variant default one column panel
    * @variant column two or more column panel
    */

   /**
    * @name Controls/interface/IFilterPanel#title
    * @cfg {Object} Caption of filter panel.
    */

   /**
    * @name Controls/interface/IFilterPanel#styleHeader
    * @cfg {String} Color of title in header of filter panel.
    * @variant primary Blue color.
    * @variant default Orange color.
    */

   /**
    * @name Controls/interface/IFilterPanel#itemTemplate
    * @cfg {itemTpl} Template for item render.
    */

   /**
    * @name Controls/interface/IFilterPanel#additionalTemplate
    * @cfg {additionalTpl} Template for item render in block "Possible to select".
    */

   /**
    * @name Controls/interface/IFilterPanel#additionalTemplateProperty
    * @cfg {additionalTpl} Name of the item property that contains template for item render in block "Possible to select . If not set, additionalTemplate is used instead.
    */

   /**
    * @name Controls/interface/IFilterPanel#itemTemplateProperty
    * @cfg {additionalTpl} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    */

   /**
    * @name Controls/interface/IFilterPanel#historyId
    * @cfg {String} Unique id for save history.
    * @remark For the correct work of the history, you need to configure the structure of the application by the instruction https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ws4/components/filter-search/
    */

});
