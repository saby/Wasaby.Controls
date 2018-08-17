define('Controls/List/TreeGridView/TreeGridViewModel', [
   'Controls/List/Tree/TreeViewModel',
   'Controls/List/Grid/GridViewModel'
], function(TreeViewModel, GridViewModel) {

   'use strict';

   var
      TreeGridViewModel = GridViewModel.extend({
         _onNodeRemovedFn: null,
         constructor: function() {
            TreeGridViewModel.superclass.constructor.apply(this, arguments);
            this._onNodeRemovedFn = this._onNodeRemoved.bind(this);
            this._model.subscribe('onNodeRemoved', this._onNodeRemovedFn);
         },
         _createModel: function(cfg) {
            return new TreeViewModel(cfg);
         },
         toggleExpanded: function(dispItem) {
            this._model.toggleExpanded(dispItem);
         },
         setRoot: function(root) {
            this._model.setRoot(root);
         },
         _onNodeRemoved: function(event, nodeId) {
            this._notify('onNodeRemoved', nodeId);
         },
         destroy: function() {
            this._model.unsubscribe('onNodeRemoved', this._onNodeRemovedFn);
            TreeGridViewModel.superclass.destroy.apply(this, arguments);
         }
      });

   return TreeGridViewModel;
});
