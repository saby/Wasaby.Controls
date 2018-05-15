define([
   'Controls/Utils/BreadCrumbsUtil'
], function(
   BreadCrumbsUtil
) {
   describe('Controls.Utils.BreadCrumbsUtil', function() {
      var data;
      beforeEach(function() {
         if (!window) {
            document = {
               createElement: function() {
                  return {
                     innerHTML: '',
                     classList: {
                        add: function() {

                        }
                     },
                     getElementsByClassName: function() {
                        return [
                           {
                              clientWidth: 97
                           },
                           {
                              clientWidth: 112
                           },
                           {
                              clientWidth: 70
                           },
                           {
                              clientWidth: 70
                           },
                           {
                              clientWidth: 368
                           }
                        ];
                     },
                     clientWidth: 16
                  };
               },
               body: {
                  appendChild: function() {

                  },
                  removeChild: function() {

                  }
               }
            };
         }
         data = [
            {
               id: 2,
               title: 'Notebooks 2'
            },
            {
               id: 3,
               title: 'Smartphones 3'
            },
            {
               id: 4,
               title: 'Record1'
            },
            {
               id: 5,
               title: 'Record2'
            },
            {
               id: 6,
               title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw'
            }
         ];
      });
      afterEach(function() {
         if (!window) {
            document = undefined;
         }
      });
      it('getWidth', function() {
         var result = BreadCrumbsUtil.getWidth('<span class="controls-BreadCrumbsV__arrow icon-size icon-DayForward icon-primary action-hover"></span>');
         assert.equal(result, 16);
      });

      it('getMaxCrumbsWidth', function() {
         var result = BreadCrumbsUtil.getMaxCrumbsWidth(data);

         //Если тесты гоняются под нодой, то ширина домика 0, но если тесты гоняются в браузере, то ширина домика 20
         if (window) {
            assert.equal(result, 737);
         } else {
            assert.equal(result, 717);
         }
      });

      describe('calculateBreadCrumbsToRedraw', function() {
         it('draw everything', function() {
            var self = {};
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 1920);
            assert.equal(self._visibleItems.length, data.length);
         });
         it('shrink second to last', function() {
            var self = {};
            if (window) {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 724);
            } else {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 700);
            }
            assert.equal(self._visibleItems.length, data.length);
            assert.isTrue(self._visibleItems[self._visibleItems.length - 2].withOverflow);
         });
         it('hide 2 items without shrinking', function() {
            var self = {};
            if (window) {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 645);
            } else {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 577);
            }
            assert.equal(self._visibleItems.length, data.length - 1);
            assert.isTrue(self._visibleItems[self._visibleItems.length - 2].isDots);
            assert.isFalse(self._visibleItems[self._visibleItems.length - 3].withOverflow);
         });
         it('hide 2 items with shrinking', function() {
            var self = {};
            if (window) {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 640);
            } else {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 570);
            }
            assert.equal(self._visibleItems.length, data.length - 1);
            assert.isTrue(self._visibleItems[self._visibleItems.length - 2].isDots);
            assert.isTrue(self._visibleItems[self._visibleItems.length - 3].withOverflow);
         });
         it('hide all items except first and last', function() {
            var self = {};
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data, 100);
            assert.equal(self._visibleItems.length, 3);
            assert.isTrue(self._visibleItems[self._visibleItems.length - 2].isDots);
            assert.isTrue(self._visibleItems[self._visibleItems.length - 3].withOverflow);
         });
         it('only 2 items', function() {
            var self = {};
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(self, data.slice(0, 2), 100);
            assert.equal(self._visibleItems.length, 2);
         });
      });

      describe('shouldRedraw', function() {
         it('same items, same width', function() {
            assert.isFalse(BreadCrumbsUtil.shouldRedraw(data, data, 10, 10));
         });

         it('different items, same width', function() {
            assert.isTrue(BreadCrumbsUtil.shouldRedraw(data, data.slice(3), 10, 10));
         });

         it('same items, different width', function() {
            assert.isTrue(BreadCrumbsUtil.shouldRedraw(data, data, 15, 10));
         });

         it('different items, different width', function() {
            assert.isTrue(BreadCrumbsUtil.shouldRedraw(data, data.slice(3), 15, 10));
         });
      });
   });
});
