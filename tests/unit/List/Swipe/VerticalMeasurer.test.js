define(['Controls/_lists/Swipe/VerticalMeasurer', 'Core/i18n'], function(
   VerticalMeasurer,
   i18n
) {
   describe('Controls.List.Swipe.VerticalMeasurer', function() {
      it('needIcon', function() {
         assert.isFalse(VerticalMeasurer.default.needIcon({}, 'bottom'));
         assert.isFalse(VerticalMeasurer.default.needIcon({}, 'none'));
         assert.isFalse(VerticalMeasurer.default.needIcon({}, 'right'));
         assert.isFalse(VerticalMeasurer.default.needIcon({}, 'bottom', true));
         assert.isFalse(VerticalMeasurer.default.needIcon({}, 'none', true));
         assert.isTrue(VerticalMeasurer.default.needIcon({}, 'right', true));
         assert.isTrue(
            VerticalMeasurer.default.needIcon(
               {
                  icon: '123'
               },
               'bottom'
            )
         );
         assert.isTrue(
            VerticalMeasurer.default.needIcon(
               {
                  icon: '123'
               },
               'right'
            )
         );
         assert.isTrue(
            VerticalMeasurer.default.needIcon(
               {
                  icon: '123'
               },
               'none'
            )
         );
         assert.isTrue(
            VerticalMeasurer.default.needIcon(
               {
                  icon: '123'
               },
               'bottom',
               true
            )
         );
         assert.isTrue(
            VerticalMeasurer.default.needIcon(
               {
                  icon: '123'
               },
               'right',
               true
            )
         );
         assert.isTrue(
            VerticalMeasurer.default.needIcon(
               {
                  icon: '123'
               },
               'none',
               true
            )
         );
      });

      it('needTitle', function() {
         assert.isFalse(
            VerticalMeasurer.default.needTitle(
               {
                  icon: 'icon-Message'
               },
               'none'
            )
         );
         assert.isFalse(
            VerticalMeasurer.default.needTitle(
               {
                  icon: 'icon-Message'
               },
               'right'
            )
         );
         assert.isTrue(VerticalMeasurer.default.needTitle({}, 'none'));
         assert.isTrue(VerticalMeasurer.default.needTitle({}, 'right'));
         assert.isTrue(
            VerticalMeasurer.default.needTitle(
               {
                  title: '123'
               },
               'none'
            )
         );
         assert.isTrue(
            VerticalMeasurer.default.needTitle(
               {
                  title: '123'
               },
               'right'
            )
         );
         assert.isTrue(
            VerticalMeasurer.default.needTitle(
               {
                  title: '123'
               },
               'bottom'
            )
         );
      });

      describe('getSwipeConfig', function() {
         var actions = [
            {
               id: 1,
               icon: 'icon-PhoneNull'
            },
            {
               id: 2,
               icon: 'icon-Erase'
            },
            {
               id: 3,
               icon: 'icon-EmptyMessage'
            }
         ];

         describe('without title', function() {
            it('small row, only menu should be drawn', function() {
               var result = {
                  itemActionsSize: 'm',
                  itemActions: {
                     all: actions,
                     showed: [
                        {
                           icon: 'icon-SwipeMenu',
                           title: i18n.rk('Ещё'),
                           _isMenu: true,
                           showType: 0
                        }
                     ]
                  },
                  paddingSize: 'm'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(actions, 20, 'none')
               );
            });

            it('average row, all actions should be drawn, itemActionsSize should be m', function() {
               var result = {
                  itemActionsSize: 'm',
                  itemActions: {
                     all: actions,
                     showed: actions
                  },
                  paddingSize: 'm'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(actions, 120, 'none')
               );
            });

            it('big row, all actions should be drawn, itemActionsSize should be l', function() {
               var result = {
                  itemActionsSize: 'l',
                  itemActions: {
                     all: actions,
                     showed: actions
                  },
                  paddingSize: 'm'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(actions, 150, 'none')
               );
            });
         });

         describe('title on the right', function() {
            it('small row, only menu should be drawn', function() {
               var result = {
                  itemActionsSize: 'm',
                  itemActions: {
                     all: actions,
                     showed: [
                        {
                           icon: 'icon-SwipeMenu',
                           title: i18n.rk('Ещё'),
                           _isMenu: true,
                           showType: 0
                        }
                     ]
                  },
                  paddingSize: 'l'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(actions, 20, 'right')
               );
            });

            it('average row, all actions should be drawn, itemActionsSize should be m', function() {
               var result = {
                  itemActionsSize: 'm',
                  itemActions: {
                     all: actions,
                     showed: actions
                  },
                  paddingSize: 'l'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(actions, 120, 'right')
               );
            });

            it('big row, all actions should be drawn, itemActionsSize should be l', function() {
               var result = {
                  itemActionsSize: 'l',
                  itemActions: {
                     all: actions,
                     showed: actions
                  },
                  paddingSize: 'l'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(actions, 150, 'right')
               );
            });
         });

         describe('title on the bottom', function() {
            it('small row, only menu should be drawn', function() {
               var result = {
                  itemActionsSize: 'm',
                  itemActions: {
                     all: actions,
                     showed: [
                        {
                           icon: 'icon-SwipeMenu',
                           title: i18n.rk('Ещё'),
                           _isMenu: true,
                           showType: 0
                        }
                     ]
                  },
                  paddingSize: 's'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(actions, 20, 'bottom')
               );
            });

            it('average row, all actions should be drawn, itemActionsSize should be s', function() {
               var result = {
                  itemActionsSize: 'm',
                  itemActions: {
                     all: actions,
                     showed: actions
                  },
                  paddingSize: 's'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(
                     actions,
                     170,
                     'bottom'
                  )
               );
            });

            it('big row, all actions should be drawn, itemActionsSize should be l', function() {
               var result = {
                  itemActionsSize: 'l',
                  itemActions: {
                     all: actions,
                     showed: actions
                  },
                  paddingSize: 'l'
               };

               assert.deepEqual(
                  result,
                  VerticalMeasurer.default.getSwipeConfig(
                     actions,
                     200,
                     'bottom'
                  )
               );
            });
         });
      });
   });
});
