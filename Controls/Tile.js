define('Controls/Tile', [
   'Controls/List',
   'Controls/List/TreeTileView/TreeTileViewModel',
   'Controls/List/TreeTileView/TreeTileView',
   'Controls/List/TreeControl'
], function(List, TreeTileViewModel) {
   'use strict';

   /**
    * List in which items are displayed as tiles. Can load data from data source.
    * <a href="/materials/demo/demo-ws4-tile?v=19.200">Demo examples</a>.
    *
    * @class Controls/Tile
    * @extends Controls/List
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
    * @mixes Controls/List/Swipe/SwipeStyles
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

   return List.extend({
      _viewName: 'Controls/List/TreeTileView/TreeTileView',
      _viewTemplate: 'Controls/List/TreeControl',
      _getModelConstructor: function() {
         return TreeTileViewModel;
      }
   });

});
