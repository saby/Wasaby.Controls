define('Controls/List/TreeGridView/TreeGridViewModel', [
   'Controls/List/Tree/TreeViewModel',
   'Controls/List/Grid/GridViewModel'
], function(TreeViewModel, GridViewModel) {

   'use strict';

   var
      TreeGridViewModel = GridViewModel.extend({
         _createModel: function(cfg) {
            return new TreeViewModel(cfg);
         },
         toggleExpanded: function(dispItem) {
            this._model.toggleExpanded(dispItem);
         },
         setRoot: function(root) {
            this._model.setRoot(root);
         }
      });

   return TreeGridViewModel;
});
