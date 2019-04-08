import {View as List} from 'Controls/lists';
import GridViewModel = require('Controls/_grids/GridViewModel');
import viewName = require('Controls/_grids/GridView');
import {ListControl as viewTemplate} from 'Controls/lists';

   

   /**
    * Table-looking list. Can load data from data source.
    * List of examples:
    * <ul>
    *    <li><a href="/materials/demo-ws4-edit-in-place">How to configure editing in your list</a>.</li>
    *    <li><a href="/materials/demo-ws4-edit-in-place-row-editor">How to configure editing in your list with row editor template.</a>.</li>
    * </ul>
    *
    * @class Controls/_grids/Grid
    * @extends Controls/list:View
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGrouped
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/_lists/interface/IList
    * @mixes Controls/_lists/interface/IGridControl
    * @mixes Controls/interface/IGridItemTemplate
    * @mixes Controls/_lists/interface/IDraggable
    *
    * @mixes Controls/_lists/BaseControlStyles
    * @mixes Controls/_lists/ListStyles
    * @mixes Controls/_grids/GridStyles
    * @mixes Controls/_lists/ItemActions/ItemActionsStyles
    * @mixes Controls/_lists/Swipe/SwipeStyles
    *
    * @mixes Controls/_lists/Mover/MoveDialog/Styles
    * @mixes Controls/_lists/PagingStyles
    * @mixes Controls/_lists/DigitButtonsStyles
    * @mixes Controls/_grids/SortButtonStyles
    *
    * @cssModifier controls-Grid__cell_ellipsis With single-line content, cuts the text to the width of the cell, adding an ellipsis at the end
    * @cssModifier controls-Grid__header-cell_spacing_money sets the right indent for the content of the header cell to align by integers in money fields
    *
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    * @demo Controls-demo/List/Grid/BasePG
    */

   var
      Grid = List.extend(/** @lends Controls/grid:View */{
         _viewName: viewName,
         _viewTemplate: viewTemplate,
         _getModelConstructor: function() {
            return GridViewModel;
         }
      });

   Grid.getDefaultOptions = function() {
      return {
         stickyHeader: true
      };
   };

   export = Grid;

