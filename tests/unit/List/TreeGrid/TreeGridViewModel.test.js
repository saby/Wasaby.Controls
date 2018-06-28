define(['Controls/List/TreeGrid/TreeGridViewModel', 'Core/core-instance'], function(TreeGridViewModel, cInstance) {

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
   });
});
