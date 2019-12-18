define([
   'Controls/_breadcrumbs/Utils',
   'Controls/Utils/FontLoadUtil',
   'Core/Deferred',
   'Controls/Utils/getWidth'
], function(
   BreadCrumbsUtil,
   FontLoadUtil,
   Deferred,
   getWidthUtil
) {
   describe('Controls.BreadCrumbs.Utils', function() {
      var data, sandbox;
      BreadCrumbsUtil = BreadCrumbsUtil.default;

      const ARROW_WIDTH = 16;
      const BREAD_CRUMB_MIN_WIDTH = 36;
      const DOTS_WIDTH = 24;

      function stubWidthUtil() {
         const stub = sandbox.stub(getWidthUtil, 'getWidth');
         stub.withArgs('<span class="controls-BreadCrumbsView__arrow icon-size icon-DayForwardBsLine"></span>').returns(ARROW_WIDTH);
         stub.withArgs('<div class="controls-BreadCrumbsView__title_min"></div>').returns(BREAD_CRUMB_MIN_WIDTH);
         stub.withArgs('<div class="controls-BreadCrumbsView__crumb"><span class="controls-BreadCrumbsView__arrow icon-size icon-DayForwardBsLine controls-BreadCrumbsView__arrow_enabled"></span><div class="controls-BreadCrumbsView__titleWrapper"><div class="controls-BreadCrumbsView__title controls-BreadCrumbsView__title_enabled">...</div></div></div>').returns(DOTS_WIDTH);
      }

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
         sandbox = sinon.createSandbox();
         stubWidthUtil();
      });

      afterEach(function() {
         sandbox.restore();
      });

      describe('shouldRedraw', function() {
         let container = {
            getClientRects: () => {
               return [1];
            }
         };
         it('same items, same width', function() {
            assert.isFalse(BreadCrumbsUtil.shouldRedraw(data, data, 10, 10, container));
         });

         it('different items, same width', function() {
            assert.isTrue(BreadCrumbsUtil.shouldRedraw(data, data.slice(3), 10, 10, container));
         });

         it('same items, different width', function() {
            assert.isTrue(BreadCrumbsUtil.shouldRedraw(data, data, 15, 10, container));
         });

         it('different items, different width', function() {
            assert.isTrue(BreadCrumbsUtil.shouldRedraw(data, data.slice(3), 15, 10, container));
         });
      });

      describe('getMinCrumbsWidth', function() {
         it('should return min width of one crumb', function() {
            assert.equal(BreadCrumbsUtil.getMinCrumbsWidth(1), BREAD_CRUMB_MIN_WIDTH);
         });
         it('should return min width of two crumbs and one arrow', function() {
            assert.equal(BreadCrumbsUtil.getMinCrumbsWidth(2), BREAD_CRUMB_MIN_WIDTH * 2 + ARROW_WIDTH);
         });
         it('should return min width of two crumbs, two arrows and dots', function() {
            assert.equal(BreadCrumbsUtil.getMinCrumbsWidth(3), BREAD_CRUMB_MIN_WIDTH * 2 + ARROW_WIDTH * 2 + DOTS_WIDTH);
         });
      });
   });
});
