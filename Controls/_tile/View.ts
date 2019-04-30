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
 * @mixes Controls/_list/interface/IList
 * @mixes Controls/_list/interface/IHierarchy
 * @mixes Controls/_treeGrid/interface/ITreeControl
 * @mixes Controls/_list/interface/IDraggable
 * @mixes Controls/List/interface/ITile
 *
 * @mixes Controls/_list/BaseControlStyles
 * @mixes Controls/_list/ListStyles
 * @mixes Controls/List/View/Styles
 * @mixes Controls/_list/ItemActions/ItemActionsStyles
 * @mixes Controls/_list/Swipe/SwipeStyles
 *
 * @mixes Controls/_MoveDialog/Styles
 * @mixes Controls/_paging/PagingStyles
 * @mixes Controls/_list/DigitButtonsStyles
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
