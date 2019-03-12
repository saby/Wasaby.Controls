define('Controls/TreeGrid', [
   'Controls/Grid',
   'Controls/List/TreeGridView/TreeGridViewModel',
   'Types/entity',
   'Controls/List/TreeGridView/TreeGridView',
   'Controls/List/TreeControl'
], function(Grid, TreeGridViewModel, entity) {
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
    * @mixes Controls/interface/IGrouped
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IList
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @mixes Controls/interface/ITreeGridItemTemplate
    * @mixes Controls/List/interface/IDraggable
    *
    * @mixes Controls/List/BaseControlStyles
    * @mixes Controls/List/ListStyles
    * @mixes Controls/List/Grid/GridStyles
    * @mixes Controls/List/TreeGrid/Styles
    * @mixes Controls/List/ItemActions/ItemActionsStyles
    * @mixes Controls/_lists/Swipe/SwipeStyles
    *
    * @mixes Controls/List/Mover/MoveDialog/Styles
    * @mixes Controls/List/PagingStyles
    * @mixes Controls/List/DigitButtonsStyles
    * @mixes Controls/List/Grid/SortButtonStyles
    *
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    * @demo Controls-demo/List/TreeGrid/BasePG
    */

   var Tree = Grid.extend(/** @lends Controls/TreeGrid */{
      _viewName: 'Controls/List/TreeGridView/TreeGridView',
      _viewTemplate: 'Controls/List/TreeControl',
      _getModelConstructor: function() {
         return TreeGridViewModel;
      },
      getOptionTypes: function() {
         return {
            keyProperty: entity.descriptor(String).required(),
            parentProperty: entity.descriptor(String).required()
         };
      },
      toggleExpanded: function(id) {
         this._children.listControl.toggleExpanded(id);
      }
   });
   return Tree;
});
