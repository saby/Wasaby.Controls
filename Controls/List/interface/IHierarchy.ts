define('Controls/List/interface/IHierarchy', [
], function() {

   /**
    * Interface for hierarchical lists.
    *
    * @interface Controls/List/interface/IHierarchy
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/List/interface/IHierarchy#nodeProperty
    * @cfg {String} Name of the field describing the type of the node (list, node, hidden node).
    * @example
    * In this example, item with id: 4 is parent for items with id: 5, 6, 7.
    * TMPL:
    * <pre>
    *    <Controls.Tree
    *       keyProperty="id"
    *       source="{{_source}}"
    *       parentProperty="parent"
    *       nodeProperty="parent@"/>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory({
    *       data: [
    *           { id: 1, title: 'Task in development', parent: null, 'parent@': false },
    *           { id: 2, title: 'Error in development', parent: null, 'parent@': false },
    *           { id: 3, title: 'Application', parent: null, 'parent@': false },
    *           { id: 4, title: 'Assignment', parent: null, 'parent@': true },
    *           { id: 5, title: 'Assignment for accounting', parent: 4, 'parent@': false },
    *           { id: 6, title: 'Assignment for delivery', parent: 4, 'parent@': false },
    *           { id: 7, title: 'Assignment for logisticians', parent: 4, 'parent@': false }
    *       ],
    *       idProperty: 'id'
    *    });
    * </pre>
    */

   /**
    * @name Controls/List/interface/IHierarchy#parentProperty
    * @cfg {String} Name of the field that contains information about parent node.
    * @example
    * In this example, item with id: 4 is parent for items with id: 5, 6, 7.
    * TMPL:
    * <pre>
    *    <Controls.Tree
    *       keyProperty="id"
    *       source="{{_source}}"
    *       parentProperty="parent"
    *       nodeProperty="parent@"/>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory({
    *       data: [
    *           { id: 1, title: 'Task in development', parent: null, 'parent@': false },
    *           { id: 2, title: 'Error in development', parent: null, 'parent@': false },
    *           { id: 3, title: 'Application', parent: null, 'parent@': false },
    *           { id: 4, title: 'Assignment', parent: null, 'parent@': true },
    *           { id: 5, title: 'Assignment for accounting', parent: 4, 'parent@': false },
    *           { id: 6, title: 'Assignment for delivery', parent: 4, 'parent@': false },
    *           { id: 7, title: 'Assignment for logisticians', parent: 4, 'parent@': false }
    *       ],
    *       idProperty: 'id'
    *    });
    * </pre>
    */


});
