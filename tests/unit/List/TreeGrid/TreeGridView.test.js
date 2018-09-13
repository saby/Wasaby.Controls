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
      it('TreeGridView._onLoadMoreClick', function() {
         var
            treeGridView = new TreeGridView(),
            notifyLoadMoreClickCalled = false;
         treeGridView._notify = function(eventName) {
            if (eventName === 'loadMoreClick') {
               notifyLoadMoreClickCalled = true;
            }
         };
         treeGridView._onLoadMoreClick(null, {});
         assert.isTrue(notifyLoadMoreClickCalled, 'Incorrect notify by "_onLoadMoreClick()".');
      });
   });
});
