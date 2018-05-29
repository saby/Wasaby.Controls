define('Controls/List/TreeGrid/TreeGridViewModel', [
   'Controls/List/Tree/TreeViewModel',
   'Controls/List/Grid/GridViewModel'
], function(TreeViewModel, GridViewModel) {

   'use strict';

   var
      _private = {
         onListChangeCallback: function() {
            this._nextVersion();
            this._notify('onListChange');
         }
      },

      TreeGridViewModel = GridViewModel.extend({
         _onListChangeCallback: null,

         constructor: function() {
            TreeGridViewModel.superclass.constructor.apply(this, arguments);
            this._onListChangeCallback = _private.onListChangeCallback.bind(this);
            this._model.subscribe('onListChange', this._onListChangeCallback);
         },
         _createModel: function(cfg) {
            return new TreeViewModel(cfg);
         },
         toggleExpanded: function(dispItem) {
            this._model.toggleExpanded(dispItem);
         }
      });

   return TreeGridViewModel;
});
