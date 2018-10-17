define('Controls/interface/IGroupedView', [
], function() {

   /**
    * Interface for components implementing item grouping.
    *
    * @interface Controls/interface/IGroupedView
    * @public
    */

   /**
    * @name Controls/interface/IGroupedView#groupMethod
    * @property {Function} groupMethod Function that returns group identifier for a given item.
    */

   /**
    * @name Controls/interface/IGroupedView#groupTemplate
    * @property {String} groupTemplate Group template.
    */

   /**
    * @name Controls/interface/IGroupedView#collapsedGroups
    * @property {Object} collapsedGroups List of collapsed groups.
    */

   /**
    * @name Controls/interface/IGroupedView#storeCollapsedGroups
    * @property {Boolean} storeCollapsedGroups Store a list of collapsed groups.
    */

   /**
    * @name Controls/interface/IGroupedView#storeKeyCollapsedGroups
    * @property {Boolean} storeKeyCollapsedGroups Key, using for store a list of collapsed groups.
    */

   /**
    * @event Controls/interface/IGroupedView#groupExpanded Occurs after group expansion.
    */

   /**
    * @event Controls/interface/IGroupedView#groupCollapsed Occurs after group collapse.
    */

});
