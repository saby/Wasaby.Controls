define([
   'Controls/BreadCrumbs/Path',
   'Controls/Utils/BreadCrumbsUtil',
   'Controls/Utils/FontLoadUtil',
   'Core/Deferred'
], function(
   Path,
   BreadCrumbsUtil,
   FontLoadUtil,
   Deferred
) {
   describe('Controls.BreadCrumbs.Path', function() {
      var path, data, getWidth, getMaxCrumbsWidth, calculateBreadCrumbsToDraw;

      function mockBreadCrumbsUtil(backButtonWidth, maxCrumbsWidth) {
         getWidth = BreadCrumbsUtil.getWidth;
         BreadCrumbsUtil.getWidth = function() {
            return backButtonWidth;
         };
         getMaxCrumbsWidth = BreadCrumbsUtil.getMaxCrumbsWidth;
         BreadCrumbsUtil.getMaxCrumbsWidth = function() {
            return maxCrumbsWidth;
         };
         calculateBreadCrumbsToDraw = BreadCrumbsUtil.calculateBreadCrumbsToDraw;
         BreadCrumbsUtil.calculateBreadCrumbsToDraw = function() {

         };
      }

      beforeEach(function() {
         FontLoadUtil.waitForFontLoad = function() {
            return Deferred.success();
         };
         data = [
            {
               id: 1,
               title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1'
            },
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
         path = new Path();
         path.saveOptions({
            items: data
         });
      });
      afterEach(function() {
         path = null;
      });
      describe('_afterMount', function() {
         afterEach(function() {
            BreadCrumbsUtil.getWidth = getWidth;
            BreadCrumbsUtil.getMaxCrumbsWidth = getMaxCrumbsWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw = calculateBreadCrumbsToDraw;
         });

         it('simple', function() {
            mockBreadCrumbsUtil(650, 650);
            path._container = {
               clientWidth: 1920
            };
            path._afterMount();
            assert.equal(path._backButtonClass, '');
            assert.equal(path._breadCrumbsClass, '');
         });

         it('long backButton, short crumbs', function() {
            mockBreadCrumbsUtil(961, 650);
            path._container = {
               clientWidth: 1920
            };
            path._afterMount();
            assert.equal(path._backButtonClass, 'controls-BreadCrumbsPath__backButton_long');
            assert.equal(path._breadCrumbsClass, 'controls-BreadCrumbsPath__breadCrumbs_short');
         });

         it('half backButton, half crumbs', function() {
            mockBreadCrumbsUtil(961, 961);
            path._container = {
               clientWidth: 1920
            };
            path._afterMount();
            assert.equal(path._backButtonClass, 'controls-BreadCrumbsPath__backButton_half');
            assert.equal(path._breadCrumbsClass, 'controls-BreadCrumbsPath__breadCrumbs_half');
         });

         it('short backButton, long crumbs', function() {
            mockBreadCrumbsUtil(650, 961);
            path._container = {
               clientWidth: 1920
            };
            path._afterMount();
            assert.equal(path._backButtonClass, 'controls-BreadCrumbsPath__backButton_short');
            assert.equal(path._breadCrumbsClass, 'controls-BreadCrumbsPath__breadCrumbs_long');
         });
      });

      describe('_beforeUpdate', function() {
         afterEach(function() {
            BreadCrumbsUtil.getWidth = getWidth;
            BreadCrumbsUtil.getMaxCrumbsWidth = getMaxCrumbsWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw = calculateBreadCrumbsToDraw;
         });

         it('remove all items', function() {
            path._visibleItems = [1, 2, 3];
            path._breadCrumbsItems = [2, 3];
            path._container = {
               clientWidth: 1920
            };
            path._beforeUpdate({
               items: []
            });
            assert.equal(path._visibleItems.length, 0);
            assert.equal(path._breadCrumbsItems.length, 0);
         });
      });

      it('_onItemClick', function() {
         path._notify = function(e, item) {
            if (e === 'itemClick') {
               assert.equal(path._options.items[1], item[0]);
            }
         };
         path._onItemClick({}, path._options.items[1]);
      });

      it('_onBackButtonClick', function() {
         path._notify = function(e, item) {
            if (e === 'itemClick') {
               assert.equal(path._options.items[0], item[0]);
            }
         };
         path._onBackButtonClick({}, path._options.items[0]);
      });
   });
});
