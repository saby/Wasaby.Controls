define([
   'Controls/List/Swipe/List'
], function(
   ListSwipe
) {
   describe('Controls.List.Swipe.List', function() {
      var showMore = {
         icon: 'icon-ExpandDown icon-primary controls-itemActionsV__action_icon icon-size',
         height: 'auto',
         isMenu: true
      };

      it('needShowTitle', function() {
         assert.isTrue(ListSwipe.needShowTitle(false, 3));
         assert.isTrue(ListSwipe.needShowTitle(false, 4));
         assert.isTrue(ListSwipe.needShowTitle(false, 7));
         assert.isTrue(ListSwipe.needShowTitle(false, 8));
         assert.isTrue(ListSwipe.needShowTitle(false, 11));
         assert.isTrue(ListSwipe.needShowTitle(false, 12));
         assert.isTrue(ListSwipe.needShowTitle({ title: true }, 5));
         assert.isFalse(ListSwipe.needShowTitle({ title: true, icon: true }, 9));
         assert.isFalse(ListSwipe.needShowTitle({ title: true, icon: true }, 10));
      });
      it('needShowIcon', function() {
         assert.isTrue(ListSwipe.needShowIcon({ icon: 'icon-16 icon-Alert icon-primary' }, 'row', true));
         assert.isTrue(ListSwipe.needShowIcon({ icon: 'icon-16 icon-Alert icon-primary' }, 'column', true));
         assert.isTrue(ListSwipe.needShowIcon({}, 'row', true));
         assert.isFalse(ListSwipe.needShowIcon({}, 'row', false));
         assert.isFalse(ListSwipe.needShowIcon({}, 'column', true));
         assert.isFalse(ListSwipe.needShowIcon({}, 'column', false));
      });

      describe('needShowSeparator', function() {
         it('row', function() {
            var itemActions = {
               all: [1, 2, 3, 4, 5, 6, 7, 8],
               showed: [1, 2]
            };
            assert.isTrue(ListSwipe.needShowSeparator(1, itemActions, 1));
            assert.isFalse(ListSwipe.needShowSeparator(2, itemActions, 1));
         });

         it('one column', function() {
            var itemActions = {
               all: [1, 2, 3, 4, 5, 6, 7, 8],
               showedFirst: [1, 2]
            };
            assert.isFalse(ListSwipe.needShowSeparator(2, itemActions, 9));
            assert.isFalse(ListSwipe.needShowSeparator({ isMenu: true }, itemActions, 9));
         });

         it('two columns', function() {
            var itemActions = {
               all: [1, 2, 3, 4, 5, 6, 7, 8],
               showedFirst: [1, 2, 3, 4],
               showedSecond: [5, 6, 7, 8]
            };
            assert.isFalse(ListSwipe.needShowSeparator({ isMenu: true }, itemActions, 6));
            assert.isTrue(ListSwipe.needShowSeparator(3, itemActions, 9));
         });
      });

      it('getSwipeConfig', function() {
         function mockItemActions(count) {
            return {
               all: {
                  length: count
               }
            };
         }
         var tests = [
            {
               itemActionsCount: 5,
               actionsHeight: 37,
               result: {
                  type: 1,
                  direction: 'row',
                  isFull: false,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 44,
               result: {
                  type: 2,
                  direction: 'row',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 52,
               result: {
                  type: 3,
                  direction: 'row',
                  isFull: false,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 55,
               result: {
                  type: 4,
                  direction: 'row',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 72,
               result: {
                  type: 4,
                  direction: 'row',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 73,
               result: {
                  type: 13,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'small',
                  bigTitle: true
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 109,
               result: {
                  type: 13,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'small',
                  bigTitle: true
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 110,
               result: {
                  type: 9,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 133,
               result: {
                  type: 9,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 134,
               result: {
                  type: 10,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 157,
               result: {
                  type: 10,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 158,
               result: {
                  type: 11,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 181,
               result: {
                  type: 11,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 182,
               result: {
                  type: 12,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 183,
               result: {
                  type: 12,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 6,
               actionsHeight: 183,
               result: {
                  type: 12,
                  direction: 'column',
                  isFull: false,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 184,
               result: {
                  type: 5,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 223,
               result: {
                  type: 5,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 224,
               result: {
                  type: 6,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 263,
               result: {
                  type: 6,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 264,
               result: {
                  type: 7,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 303,
               result: {
                  type: 7,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'small',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 304,
               result: {
                  type: 8,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            },
            {
               itemActionsCount: 5,
               actionsHeight: 604,
               result: {
                  type: 8,
                  direction: 'column',
                  isFull: true,
                  swipeIconSize: 'big',
                  bigTitle: false
               }
            }
         ];
         tests.forEach(function(test, index) {
            assert.deepEqual(ListSwipe.getSwipeConfig(mockItemActions(test.itemActionsCount), test.actionsHeight), test.result, 'error in test: ' + index);
         });
      });

      describe('initItemsForSwipe', function() {
         it('row', function() {
            var itemActions = {
               all: [
                  {
                     id: 0
                  }, {
                     id: 1
                  }
               ]
            };
            var result = ListSwipe.initItemsForSwipe(itemActions, 100, 1);
            assert.equal(itemActions, result);
            result.all.forEach(function(item) {
               assert.equal(item.height, '36px');
            });
         });

         it('one column', function() {
            var itemActions = {
               all: [
                  {
                     id: 0
                  }, {
                     id: 1
                  }
               ]
            };
            var result = ListSwipe.initItemsForSwipe(itemActions, 100, 6);
            assert.equal(result.all, itemActions.all);
            assert.equal(result.showedFirst, itemActions.all);
            result.all.forEach(function(item) {
               assert.equal(item.height, '44px');
            });
         });

         it('two columns', function() {
            var itemActions = {
               all: [
                  {
                     id: 0
                  }, {
                     id: 1
                  }
               ]
            };
            var result = ListSwipe.initItemsForSwipe(itemActions, 100, 11);
            assert.equal(result.all, itemActions.all);
            assert.deepEqual(result.showedFirst, [itemActions.all[0]]);
            assert.deepEqual(result.showedSecond, [itemActions.all[1]]);
            result.showedFirst.forEach(function(item) {
               assert.equal(item.height, '100px');
            });
            result.showedSecond.forEach(function(item) {
               assert.equal(item.height, '100px');
            });
         });

         it('two columns, three items', function() {
            var itemActions = {
               all: [
                  {
                     id: 0
                  }, {
                     id: 1
                  }, {
                     id: 2
                  }
               ]
            };
            var result = ListSwipe.initItemsForSwipe(itemActions, 100, 9);
            assert.equal(result.all, itemActions.all);
            assert.deepEqual(result.showedFirst, [itemActions.all[0]]);
            assert.deepEqual(result.showedSecond, [itemActions.all[1], itemActions.all[2]]);
            result.showedFirst.forEach(function(item) {
               assert.equal(item.height, '49px');
            });
            result.showedSecond.forEach(function(item) {
               assert.equal(item.height, '49px');
            });
         });

         it('two columns, five items', function() {
            var itemActions = {
               all: [
                  {
                     id: 0
                  }, {
                     id: 1
                  }, {
                     id: 2
                  }, {
                     id: 3
                  }, {
                     id: 4
                  }
               ]
            };
            var result = ListSwipe.initItemsForSwipe(itemActions, 110, 9);
            assert.equal(result.all, itemActions.all);
            assert.deepEqual(result.showedFirst, [itemActions.all[0], itemActions.all[1]]);
            assert.deepEqual(result.showedSecond, [itemActions.all[2], itemActions.all[3], itemActions.all[4]]);
            result.showedFirst.forEach(function(item) {
               assert.equal(item.height, '36px');
            });
            result.showedSecond.forEach(function(item) {
               assert.equal(item.height, '36px');
            });
         });

         it('two columns and menu', function() {
            var itemActions = {
               all: [
                  {
                     id: 0
                  }, {
                     id: 1
                  }, {
                     id: 2
                  }, {
                     id: 3
                  }, {
                     id: 4
                  }
               ]
            };
            var result = ListSwipe.initItemsForSwipe(itemActions, 73, 13);
            assert.equal(result.all, itemActions.all);
            assert.deepEqual(result.showedFirst, [itemActions.all[0], itemActions.all[1]]);
            assert.deepEqual(result.showedSecond, [itemActions.all[2], showMore]);
            result.showedFirst.forEach(function(item) {
               assert.equal(item.height, '36px');
            });
            assert.equal(result.showedSecond[0].height, '36px');
            assert.equal(result.showedSecond[1].height, 'auto');
         });
      });
   });
});
