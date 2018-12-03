define('Controls/List/interface/ITreeControl', [
], function() {

   /**
    * Interface for tree-like lists.
    *
    * @interface Controls/List/interface/ITreeControl
    * @public
    * @author Авраменко А.С.
    */


   /**
    * @typedef {String} hierarchyViewModeEnum
    * @variant tree Tree-like view.
    * @variant breadcrumbs Just leaves, folders as paths.
    */

   /**
    * @name Controls/List/interface/ITreeControl#treeViewMode
    * @cfg {hierarchyViewModeEnum} Hierarchy view mode.
    */

   /**
    * @name Controls/List/interface/ITreeControl#singleExpand
    * @cfg {Boolean} Allow only one node to be expanded. If another one is expanded, the previous one will collapse.
    */

   /**
    * @name Controls/List/interface/ITreeControl#expandedItems
    * @cfg {{Array.<String>}} Array of identifiers of expanded items.
    * <b>Note:</b>
    * To expand all items, this option must be set as array containing one element “null”.
    * In this case, it is assumed that all data will be loaded initially.
    */

   /**
    * @name Controls/List/interface/ITreeControl#collapsedItems
    * @cfg {Boolean} Array of identifiers of collapsed items.
    * This option is used only when the value of  {@link Controls/List/interface/ITreeControl#expandedItems expandedItems} is [null].
    */

   /**
    * @name Controls/List/interface/ITreeControl#nodeFooterTemplate
    * @cfg {Function} Sets footer template that will be shown for every node.
    */

   /**
    * @name Controls/List/interface/ITreeControl#hasChildrenProperty
    * @cfg {String} Name of the field that contains information whether the node has children.
    */

   /**
    * @name Controls/List/interface/ITreeControl#expanderDisplayMode
    * @cfg {String} Mode displaying expander indent.
    * @variant alwaysVisible Always show expander for nodes and indentation for leaves.
    * @variant adaptive Show expander only for nodes with children.
    * @default alwaysVisible
    */

   /**
    * @event Controls/List/interface/ITreeControl#itemExpand Occurs before node expansion.
    */
   /**
    * @event Controls/List/interface/ITreeControl#itemExpanded Occurs after node expansion.
    */
   /**
    * @event Controls/List/interface/ITreeControl#itemCollapse Occurs before node collapse.
    */
   /**
    * @event Controls/List/interface/ITreeControl#itemCollapsed Occurs after node collapse.
    */

});
