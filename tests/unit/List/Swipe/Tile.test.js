define([
   'Controls/List/Swipe/Tile',
   'Core/i18n'
], function(
   TileSwipe,
   i18n
) {
   describe('Controls.List.Swipe.Tile', function() {
      var showMore = {
         title: i18n.rk('Еще'),
         icon: 'icon-ExpandDown icon-primary controls-itemActionsV__action_icon icon-size',
         isMenu: true
      };

      it('needShowTitle', function() {
         assert.isFalse(TileSwipe.needShowTitle());
      });
      it('needShowIcon', function() {
         assert.isTrue(TileSwipe.needShowIcon());
      });

      describe('needShowSeparator', function() {
         it('one column', function() {
            var itemActions = {
               all: [1, 2, 3, 4, 5, 6, 7, 8],
               showedFirst: [1, 2]
            };
            assert.isFalse(TileSwipe.needShowSeparator(2, itemActions));
            assert.isFalse(TileSwipe.needShowSeparator({ isMenu: true }, itemActions));
         });
      });

      it('getSwipeConfig', function() {
         assert.deepEqual(TileSwipe.getSwipeConfig(), {
            direction: 'column',
            isFull: true,
            swipeIconSize: 'big'
         });
      });

      describe('initItemsForSwipe', function() {
         it('enough height for everything', function() {
            var itemActions = {
               all: [
                  {
                     icon: 0
                  }, {
                     icon: 1
                  }
               ]
            };
            var result = TileSwipe.initItemsForSwipe(itemActions, 100);
            assert.deepEqual(result.all, itemActions.all);
            assert.deepEqual(result.showedFirst, itemActions.all);
         });

         it('enough height for one item and menu', function() {
            var itemActions = {
               all: [
                  {
                     icon: 0
                  }, {
                     icon: 1
                  }, {
                     icon: 1
                  }
               ]
            };
            var result = TileSwipe.initItemsForSwipe(itemActions, 90);
            assert.deepEqual(result.all, itemActions.all);
            assert.deepEqual(result.showedFirst, [itemActions.all[0], showMore]);
         });

         it('enough height for menu only', function() {
            var itemActions = {
               all: [
                  {
                     icon: 0
                  }, {
                     icon: 1
                  }
               ]
            };
            var result = TileSwipe.initItemsForSwipe(itemActions, 40);
            assert.deepEqual(result.all, itemActions.all);
            assert.deepEqual(result.showedFirst, [showMore]);
         });
      });
   });
});
