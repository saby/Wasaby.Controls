define('Controls/List/TreeGrid/TreeGridViewModel', [
   'Controls/List/Tree/TreeViewModel',
   'Controls/List/Grid/GridViewModel'
], function(TreeViewModel, GridViewModel) {

   'use strict';

   var
      _private = {
      },

      TreeGridViewModel = GridViewModel.extend({
         _createModel: function(cfg) {
            return new TreeViewModel(cfg);
         },
         toggleExpanded: function(dispItem) {
            this._model.toggleExpanded(dispItem);
            this._nextVersion();
            this._notify('onListChange');
         }
      });

   return TreeGridViewModel;
});
