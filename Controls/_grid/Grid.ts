import {View as List} from 'Controls/list';
import GridViewModel = require('Controls/_grid/GridViewModel');
import viewName = require('Controls/_grid/GridView');
import {ListControl as viewTemplate} from 'Controls/list';



   /**
    * Table-looking list. Can load data from data source.
    * List of examples:
    * <ul>
    *    <li><a href="/materials/demo-ws4-edit-in-place">How to configure editing in your list</a>.</li>
    *    <li><a href="/materials/demo-ws4-edit-in-place-row-editor">How to configure editing in your list with row editor template.</a>.</li>
    * </ul>
    *
    * @class Controls/_grid/Grid
    * @extends Controls/list:View
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGrouped
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/_list/interface/IList
    * @mixes Controls/_grid/interface/IGridControl
    * @mixes Controls/interface/IGridItemTemplate
    * @mixes Controls/_list/interface/IDraggable
    *
    * @mixes Controls/_list/BaseControlStyles
    * @mixes Controls/_list/ListStyles
    * @mixes Controls/_grid/GridStyles
    * @mixes Controls/_list/ItemActions/ItemActionsStyles
    * @mixes Controls/_list/Swipe/SwipeStyles
    *
    * @mixes Controls/_list/Mover/MoveDialog/Styles
    * @mixes Controls/_paging/PagingStyles
    * @mixes Controls/_list/DigitButtonsStyles
    * @mixes Controls/_grid/SortButtonStyles
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

