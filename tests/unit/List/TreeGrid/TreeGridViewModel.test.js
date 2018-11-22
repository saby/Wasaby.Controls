define(['Controls/List/TreeGridView/TreeGridViewModel', 'Core/core-instance'], function(TreeGridViewModel, cInstance) {

   describe('Controls.List.TreeGrid.TreeGridViewModel', function() {
      var
         treeGridViewModel = new TreeGridViewModel({columns:[]});
      it('_createModel', function() {
         var
            createdModel = treeGridViewModel._createModel({});
         assert.isTrue(cInstance.instanceOfModule(createdModel, 'Controls/List/Tree/TreeViewModel'), 'Invalid type of created model.');
      });
      it('toggleExpanded', function() {
         var
            toggleExpandedCalled = false;
         treeGridViewModel._model.toggleExpanded = function() {
            toggleExpandedCalled = true;
         };
         treeGridViewModel.toggleExpanded();
         assert.isTrue(toggleExpandedCalled, 'Invalid call toggleExpanded on model instance.');
      });
      it('setExpandedItems', function() {
         treeGridViewModel._model._display = {
            setFilter: function() {}
         };
         treeGridViewModel.setExpandedItems([]);
         assert.deepEqual({}, treeGridViewModel._model._expandedItems);

         treeGridViewModel.setExpandedItems([1, 2]);
         assert.deepEqual({
            1: true,
            2: true
         }, treeGridViewModel._model._expandedItems);
      });
      it('notify "onNodeRemoved"', function() {
         var
            notifiedOnNodeRemoved = false;
         treeGridViewModel._notify = function(eventName, nodeId) {
            assert.equal(nodeId, 1, 'Invalid argument notify "onNodeRemoved".');
            notifiedOnNodeRemoved = true;
         };
         treeGridViewModel._onNodeRemoved(null, 1);
         assert.isTrue(notifiedOnNodeRemoved, 'Invalid call _notify("onNodeRemoved").');
      });
      it('setRoot', function() {
         var
            setRootCalled = false;
         treeGridViewModel._model.setRoot = function() {
            setRootCalled = true;
         };
         treeGridViewModel.setRoot('testRoot');
         assert.isTrue(setRootCalled, 'Invalid call toggleExpanded on model instance.');
      });
      it('setExpandedItems', function() {

         treeGridViewModel._model._expandedItems = null;

         treeGridViewModel._model.setExpandedItems = function(expandedItems) {
            treeGridViewModel._model._expandedItems = expandedItems;
         };

         treeGridViewModel.setExpandedItems({
            '123': true,
            '234': true
         });
         assert.deepEqual({
            '123': true,
            '234': true
         }, treeGridViewModel._model._expandedItems);

         treeGridViewModel.setExpandedItems({});
         assert.deepEqual({}, treeGridViewModel._model._expandedItems);

      });
   });
});
