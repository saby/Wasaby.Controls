define('Controls/Tile', [
   'Controls/List',
   'Controls/List/TreeTileView/TreeTileViewModel',
   'Controls/List/TreeTileView/TreeTileView',
   'Controls/List/TreeControl'
], function(List, TreeTileViewModel) {
   'use strict';

   /**
    * Plain list with custom item template. Can load data from data source.
    *
    * @class Controls/Tile
    * @extends Controls/List
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
    *
    * @mixes Controls/List/TileView/TileViewStyles
    * @mixes Controls/List/TreeTileView/TreeTileViewStyles
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
