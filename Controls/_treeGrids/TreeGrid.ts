import {View as Grid} from 'Controls/grids';
import TreeGridViewModel = require('Controls/List/TreeGridView/TreeGridViewModel');
import entity = require('Types/entity');
import 'Controls/List/TreeGridView/TreeGridView';
import 'Controls/List/TreeControl';
   

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
    * @mixes Controls/_lists/interface/IList
    * @mixes Controls/_lists/interface/IHierarchy
    * @mixes Controls/_lists/interface/ITreeControl
    * @mixes Controls/interface/ITreeGridItemTemplate
    * @mixes Controls/_lists/interface/IDraggable
    *
    * @mixes Controls/_lists/BaseControlStyles
    * @mixes Controls/_lists/ListStyles
    * @mixes Controls/_grids/GridStyles
    * @mixes Controls/_treeGrids/Styles
    * @mixes Controls/_lists/ItemActions/ItemActionsStyles
    * @mixes Controls/_list/Swipe/SwipeStyles
    *
    * @mixes Controls/_lists/Mover/MoveDialog/Styles
    * @mixes Controls/_lists/PagingStyles
    * @mixes Controls/_lists/DigitButtonsStyles
    * @mixes Controls/_grids/SortButtonStyles
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
   export = Tree;

