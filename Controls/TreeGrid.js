define('Controls/TreeGrid', [
   'Controls/Grid',
   'Controls/List/TreeGridView/TreeGridViewModel',
   'WS.Data/Type/descriptor',
   'Controls/List/TreeGridView/TreeGridView',
   'Controls/List/TreeControl'
], function(Grid, TreeGridViewModel, types) {
   'use strict';

   /**
    * Hierarchical list with custom item template. Can load data from data source.
    * List of examples:
    * <ul>
    *    <li><a href="/materials/demo-ws4-edit-in-place">How to configure editing in your list</a>.</li>
    * </ul>
    *
    * @class Controls/TreeGrid
    * @extends Controls/Grid
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   var Tree = Grid.extend(/** @lends Controls/TreeGrid */{
      _viewName: 'Controls/List/TreeGridView/TreeGridView',
      _viewTemplate: 'Controls/List/TreeControl',
      _getModelConstructor: function() {
         return TreeGridViewModel;
      },
      getOptionTypes: function() {
         return {
            keyProperty: types(String).required(),
            parentProperty: types(String).required()
         };
      },
      toggleExpanded: function(id) {
         this._children.listControl.toggleExpanded(id);
      }
   });
   return Tree;
});
