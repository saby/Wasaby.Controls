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
    * @class Controls/Grid
    * @extends Controls/List
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGrouped
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IList
    * @mixes Controls/List/interface/IGridControl
    * @mixes Controls/interface/IGridItemTemplate
    * @mixes Controls/List/interface/IDraggable
    *
    * @mixes Controls/List/BaseControlStyles
    * @mixes Controls/List/ListStyles
    * @mixes Controls/_grids/GridStyles
    * @mixes Controls/List/ItemActions/ItemActionsStyles
    * @mixes Controls/_lists/Swipe/SwipeStyles
    *
    * @mixes Controls/List/Mover/MoveDialog/Styles
    * @mixes Controls/List/PagingStyles
    * @mixes Controls/List/DigitButtonsStyles
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
      Grid = List.extend(/** @lends Controls/Grid */{
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

