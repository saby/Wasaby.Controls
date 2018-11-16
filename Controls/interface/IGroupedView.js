define('Controls/interface/IGroupedView', [
], function() {

   /**
    * Interface for components implementing item grouping.
    *
    * @interface Controls/interface/IGroupedView
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/interface/IGroupedView#groupMethod
    * @cfg {Function} groupMethod Function that returns group identifier for a given item.
    */

   /**
    * @name Controls/interface/IGroupedView#groupTemplate
    * @cfg {String} groupTemplate Group template.
    */

   /**
    * @name Controls/interface/IGroupedView#collapsedGroups
    * @cfg {Array} collapsedGroups List of collapsed group identifiers. Identifiers of groups are obtained as a result of calling the groupMethod method.
    */

   /**
    * @name Controls/interface/IGroupedView#historyIdCollapsedGroups
    * @cfg {String} historyIdCollapsedGroups Unique id for save to history a list of identifiers collapsed groups.
    */

   /**
    * @event Controls/interface/IGroupedView#groupExpanded Occurs after group expansion.
    */

   /**
    * @event Controls/interface/IGroupedView#groupCollapsed Occurs after group collapse.
    */

});
