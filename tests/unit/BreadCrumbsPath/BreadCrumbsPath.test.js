define([
   'Controls/BreadCrumbs/Path',
   'Controls/BreadCrumbs/Utils',
   'Controls/Utils/getWidth',
   'Controls/Utils/FontLoadUtil',
   'Core/Deferred'
], function(
   Path,
   BreadCrumbsUtil,
   getWidthUtil,
   FontLoadUtil,
   Deferred
) {
   describe('Controls.BreadCrumbs.Path', function() {
      var path, data, getWidth, getMaxCrumbsWidth, calculateBreadCrumbsToDraw;

      function mockBreadCrumbsUtil(backButtonWidth, maxCrumbsWidth) {
         getWidth = getWidthUtil.getWidth;
         getWidthUtil.getWidth = function(item) {
            if (item === '<div class="controls-BreadCrumbsView__home icon-size icon-Home3 icon-primary"></div>') {
               return 24;
            } else {
               return backButtonWidth;
            }
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
            getWidthUtil.getWidth = getWidth;
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
         path._notify = function(e, args) {
            if (e === 'itemClick') {
               assert.equal(path._options.items[1], args[0]);
               assert.isFalse(!!args[1]);
            }
         };
         path._onItemClick({}, path._options.items[1]);
      });

      it('_onBackButtonClick', function() {
         path._notify = function(e, args) {
            if (e === 'itemClick') {
               assert.equal(path._options.items[0], args[0]);
               assert.isTrue(args[1]);
            }
         };
         path._onBackButtonClick({}, path._options.items[0]);
      });

      it('_onHomeClick', function() {
         path._notify = function(e, args) {
            if (e === 'itemClick') {
               assert.equal(path._options.items[1], args[0]);
               assert.isTrue(args[1]);
            }
         };
         path._onHomeClick();
      });

      it('_onArrowClick', function() {
         var eventFired = false;
         path._notify = function(e) {
            if (e === 'arrowActivated') {
               eventFired = true;
            }
         };
         path._onArrowClick();
         assert.isTrue(eventFired);
      });
   });
});
