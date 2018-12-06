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
         toggleExpanded: function(dispItem, expand) {
            this._model.toggleExpanded(dispItem, expand);
         },
         isExpanded: function(dispItem) {
            return this._model.isExpanded(dispItem);
         },
         setExpandedItems: function(expandedItems) {
            this._model.setExpandedItems(expandedItems);
         },
         setRoot: function(root) {
            this._model.setRoot(root);
         },
         getCurrent: function() {
            var
               current = TreeGridViewModel.superclass.getCurrent.apply(this, arguments),
               superGetCurrentColumn = current.getCurrentColumn;
            current.getCurrentColumn = function() {
               var
                  currentColumn = superGetCurrentColumn();
               currentColumn.isExpanded = current.isExpanded;
               return currentColumn;
            };
            return current;
         },
         _onNodeRemoved: function(event, nodeId) {
            this._notify('onNodeRemoved', nodeId);
         },
         setHasMoreStorage: function(hasMoreStorage) {
            this._model.setHasMoreStorage(hasMoreStorage);
         },
         destroy: function() {
            this._model.unsubscribe('onNodeRemoved', this._onNodeRemovedFn);
            TreeGridViewModel.superclass.destroy.apply(this, arguments);
         }
      });

   return TreeGridViewModel;
});
