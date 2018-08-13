define('Controls/interface/IFastFilter', [
], function() {

   /**
    * Interface for component Fast Filter
    * @interface Controls/interface/IFastFilter
    * @public
    */

   /**
    * @typedef {Object} PropertiesFastFilter
    * @property {String} keyProperty Name of the item property that uniquely identifies collection item.
    * @property {String} displayProperty Name of the item property that content will be displayed. Only affects the value when selecting.
    * @property {WS.Data/Source/ISource} source If the data is used. If 'items' is specified, 'source' will be ignored.
    * @property {WS.Data/Collection/IList} items If the data is used {WS.Data/Collection/IList}.
    */

   /**
    * @typedef {WS.Data/Source/ISource} FastFilterSource
    * @property {String} id Name of filter field.
    * @property {*} value Current filter field value.
    * @property {*} resetValue Value for reset.
    * @property {PropertiesFastFilter} properties Fast filter settings.
    */

   /**
    * @typedef {WS.Data/Collection/IList} FastFilterItems
    * @property {String} id Name of filter field.
    * @property {*} value Current filter field value.
    * @property {*} resetValue Value for reset.
    * @property {PropertiesFastFilter} properties Fast filter settings.
    */

   /**
    * @name Controls/interface/IFastFilter#source
    * @cfg {FastFilterSource} Sets the source of data set to use in the mapping. If 'items' is specified, 'source' will be ignored.
    */

   /**
    * @name Controls/interface/IFastFilter#items
    * @cfg {FastFilterItems} Sets a set of initial data to build the mapping.
    */

   /**
    * @event Controls/interface/IFastFilter#filterChanged Happens when filter changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Object} filter New filter.
    */

});
