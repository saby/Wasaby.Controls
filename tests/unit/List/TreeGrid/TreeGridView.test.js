define(['Controls/List/TreeGrid/TreeGridView'], function(TreeGridView) {
   describe('Controls.List.TreeGrid.TreeGridView', function() {
      it('TreeGridView._onNodeExpanderClick', function() {
         var
            treeGridView = new TreeGridView(),
            callNotify = false;
         treeGridView._notify = function() {
            callNotify = true;
         };
         treeGridView._onNodeExpanderClick();
         assert.isTrue(callNotify, 'Incorrect notify by "_onNodeExpanderClick()".');
      });
   });
});
