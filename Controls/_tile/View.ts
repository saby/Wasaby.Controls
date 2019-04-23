import {View as List} from 'Controls/list';
import TreeTileViewModel = require('Controls/_tile/TreeTileView/TreeTileViewModel');
import TreeTileView = require('Controls/_tile/TreeTileView/TreeTileView');
import {TreeControl} from 'Controls/treeGrid';

'use strict';

/**
 * List in which items are displayed as tiles. Can load data from data source.
 * <a href="/materials/demo-ws4-tile">Demo examples</a>.
 *
 * @class Controls/_tile/View
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
 * @mixes Controls/List/View/Styles
 * @mixes Controls/List/ItemActions/ItemActionsStyles
 * @mixes Controls/_list/Swipe/SwipeStyles
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

var View = List.extend({
   _viewName: TreeTileView,
   _viewTemplate: TreeControl,
   _getModelConstructor: function() {
      return TreeTileViewModel;
   }
});

View.getDefaultOptions = function() {
   return {
      actionAlignment: 'vertical',
      actionCaptionPosition: 'none'
   };
};

export = View;
