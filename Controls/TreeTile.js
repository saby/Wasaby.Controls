define('Controls/TreeTile', [
   'Controls/List',
   'Controls/List/TreeTileView/TreeTileViewModel',
   'Controls/List/TreeTileView/TreeTileView',
   'Controls/List/TreeControl'
], function(List, TreeTileViewModel) {
   'use strict';

   return List.extend({
      _viewName: 'Controls/List/TreeTileView/TreeTileView',
      _viewTemplate: 'Controls/List/TreeControl',
      _getModelConstructor: function() {
         return TreeTileViewModel;
      }
   });

});
