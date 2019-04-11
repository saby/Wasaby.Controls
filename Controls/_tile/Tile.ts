import {View} from 'Controls/list';
import TreeTileViewModel = require('Controls/_tile/TreeTileView/TreeTileViewModel');
import 'Controls/_tile/TreeTileView/TreeTileView';
import 'Controls/treeGrid';

'use strict';

/**
 * List in which items are displayed as tiles. Can load data from data source.
 * <a href="/materials/demo/demo-ws4-tile?v=19.200">Demo examples</a>.
 *
 * @class Controls/Tile
 * @extends Controls/list:View
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
 * @mixes Controls/List/interface/IDraggable
 * @mixes Controls/List/interface/ITile
 *
 * @mixes Controls/List/BaseControlStyles
 * @mixes Controls/List/ListStyles
 * @mixes Controls/List/Tile/Styles
 * @mixes Controls/List/ItemActions/ItemActionsStyles
 * @mixes Controls/_tile/Swipe/SwipeStyles
 *
 * @mixes Controls/List/Mover/MoveDialog/Styles
 * @mixes Controls/List/PagingStyles
 * @mixes Controls/List/DigitButtonsStyles
 *
 * @control
 * @author Авраменко А.С.
 * @public
 * @category List
 */

var Tile = View.extend({
   _viewName: 'Controls/_tile/TreeTileView/TreeTileView',
   _viewTemplate: 'Controls/treeGrid:TreeControl',
   _getModelConstructor: function() {
      return TreeTileViewModel;
   }
});

Tile.getDefaultOptions = function() {
   return {
      swipeDirection: 'column',
      titlePosition: 'none'
   };
};

export = Tile;
