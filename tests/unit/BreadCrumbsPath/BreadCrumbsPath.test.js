define([
   'Controls/BreadCrumbs/Path',
   'Controls/BreadCrumbs/Utils',
   'Controls/Utils/getWidth',
   'Controls/Utils/FontLoadUtil',
   'Core/Deferred',
   'WS.Data/Entity/Model'
], function(
   Path,
   BreadCrumbsUtil,
   getWidthUtil,
   FontLoadUtil,
   Deferred,
   Model
) {
   describe('Controls.BreadCrumbs.Path', function() {
      var path, data, getWidth, getMaxCrumbsWidth, calculateBreadCrumbsToDraw;

      function mockBreadCrumbsUtil(backButtonWidth, maxCrumbsWidth) {
         getWidth = getWidthUtil.getWidth;
         getWidthUtil.getWidth = function(item) {
            if (item === '<div class="controls-BreadCrumbsPath__home icon-size icon-Home3 icon-primary"></div>') {
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
               title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
               parent: null
            },
            {
               id: 2,
               title: 'Notebooks 2',
               parent: 1
            },
            {
               id: 3,
               title: 'Smartphones 3',
               parent: 2
            },
            {
               id: 4,
               title: 'Record1',
               parent: 3
            },
            {
               id: 5,
               title: 'Record2',
               parent: 4
            },
            {
               id: 6,
               title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
               parent: 5
            }
         ];
         path = new Path();
         path.saveOptions({
            items: data.map(function(item) {
               return new Model({
                  rawData: item
               });
            }),
            keyProperty: 'id',
            parentProperty: 'parent'
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
            assert.isNull(path._visibleItems);
            assert.isNull(path._breadCrumbsItems);
         });
      });

      it('_onBackButtonClick', function() {
         path._notify = function(e, args) {
            if (e === 'itemClick') {
               assert.equal(path._options.items[path._options.items.length - 1].get('parent'), args[0]);
            }
         };
         path._onBackButtonClick();
      });

      it('_onHomeClick', function() {
         var root = null;

         path._notify = function(e, args) {
            if (e === 'itemClick') {
               assert.equal(root, args[0]);
            }
         };
         path._onHomeClick();

         root = 'itemsRoot';
         path._options.root = root;
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
