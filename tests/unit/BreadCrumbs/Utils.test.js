define([
   'Controls/BreadCrumbs/Utils',
   'Controls/Utils/FontLoadUtil',
   'Core/Deferred'
], function(
   BreadCrumbsUtil,
   FontLoadUtil,
   Deferred
) {
   describe('Controls.BreadCrumbs.Utils', function() {
      var data;
      beforeEach(function() {
         FontLoadUtil.waitForFontLoad = function() {
            return Deferred.success();
         };
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
