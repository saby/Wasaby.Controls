define('Controls/List/interface/IHierarchy', [
], function() {

   /**
    * Interface for hierarchical lists.
    *
    * @interface Controls/List/interface/IHierarchy
    * @public
    */

   /**
    * @name Controls/List/interface/IHierarchy#root
    * @cfg {String} Identifier of the root node.
    */

   /**
    * @name Controls/List/interface/IHierarchy#hasChildrenProperty
    * @cfg {String} Name of the field that contains information whether the node has children.
    */

   /**
    * @name Controls/List/interface/IHierarchy#nodeProperty
    * @cfg {String} Name of the field describing the type of the node (list, node, hidden node).
    */

   /**
    * @name Controls/List/interface/IHierarchy#parentProperty
    * @cfg {String} Name of the field that contains information about parent node.
    */


});
