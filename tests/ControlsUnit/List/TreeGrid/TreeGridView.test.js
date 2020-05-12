define(['Controls/treeGrid'], function(treeGrid) {
   describe('Controls.List.TreeGridView.TreeGridView', function() {
      it('TreeGridView._onExpanderClick', function() {
         var
            stopImmediatePropagationCalled = true,
            treeGridView = new treeGrid.TreeGridView(),
            event = {
               stopImmediatePropagation: function() {
                  stopImmediatePropagationCalled = true;
               }
            },
            notifyCalled = false;
         treeGridView._notify = function() {
            notifyCalled = true;
         };
         treeGridView._onExpanderClick(event);
         assert.isTrue(notifyCalled, 'Incorrect notify by "_onExpanderClick()".');
         assert.isTrue(stopImmediatePropagationCalled, 'Incorrect call "stopImmediatePropagation" by "_onExpanderClick()".');
      });
      it('TreeGridView._onLoadMoreClick', function() {
         var
            treeGridView = new treeGrid.TreeGridView(),
            notifyLoadMoreClickCalled = false;
         treeGridView._notify = function(eventName) {
            if (eventName === 'loadMoreClick') {
               notifyLoadMoreClickCalled = true;
            }
         };
         treeGridView._onLoadMoreClick(null, {});
         assert.isTrue(notifyLoadMoreClickCalled, 'Incorrect notify by "_onLoadMoreClick()".');
      });
      it('TreeGridView._getFooterClasses', function() {
         var treeGridView = new treeGrid.TreeGridView();
         const savedSuper = treeGrid.TreeGridView.superclass._getFooterClasses;
         treeGrid.TreeGridView.superclass._getFooterClasses = () => '';

         assert.equal(treeGridView._getFooterClasses(), ' controls-TreeGridView__footer');
         treeGrid.TreeGridView.superclass._getFooterClasses = savedSuper;
      });
   });
});
