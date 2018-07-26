define(['Controls/List/TreeGridView/TreeGridView'], function(TreeGridView) {
   describe('Controls.List.TreeGridView.TreeGridView', function() {
      it('TreeGridView._onNodeExpanderClick', function() {
         var
            stopImmediatePropagationCalled = true,
            treeGridView = new TreeGridView(),
            event = {
               stopImmediatePropagation: function() {
                  stopImmediatePropagationCalled = true;
               }
            },
            notifyCalled = false;
         treeGridView._notify = function() {
            notifyCalled = true;
         };
         treeGridView._onNodeExpanderClick(event);
         assert.isTrue(notifyCalled, 'Incorrect notify by "_onNodeExpanderClick()".');
         assert.isTrue(stopImmediatePropagationCalled, 'Incorrect call "stopImmediatePropagation" by "_onNodeExpanderClick()".');
      });
   });
});
