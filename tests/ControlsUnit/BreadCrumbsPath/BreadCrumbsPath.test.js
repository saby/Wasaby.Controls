define([
   'Controls/_breadcrumbs/HeadingPath',
   'Controls/_breadcrumbs/Path',
   'Controls/_breadcrumbs/Utils',
   'Controls/Utils/getWidth',
   'Controls/Utils/FontLoadUtil',
   'Core/Deferred',
   'Types/entity'
], function(
   HeadingPath,
   Path,
   BreadCrumbsUtil,
   getWidthUtil,
   FontLoadUtil,
   Deferred,
   entity
) {
   describe('Controls.BreadCrumbs.HeadingPath', function() {
      HeadingPath = HeadingPath.default;
      BreadCrumbsUtil = BreadCrumbsUtil.default;

      var path, data, getWidth, getMaxCrumbsWidth, calculateBreadCrumbsToDraw, getContainerSpacing;

      const ARROW_WIDTH = 16;
      const BREAD_CRUMB_MIN_WIDTH = 36;
      const HOME_WIDTH = 36;
      const HOME_PATH_SPACING = 4;

      function mockBreadCrumbsUtil(backButtonWidth, maxCrumbsWidth) {
         getWidth = getWidthUtil.getWidth;
         getWidthUtil.getWidth = function(item) {
            let width;

            switch (item) {
               case '<div class="controls-BreadCrumbsPath__homeContainer"><div class="controls-BreadCrumbsPath__home icon-Home3"></div></div>':
                  width = HOME_WIDTH;
                  break;
               case '<div class="controls-BreadCrumbsView__title_min"></div>':
                  width = BREAD_CRUMB_MIN_WIDTH;
                  break;
               case '<span class="controls-BreadCrumbsView__arrow icon-size icon-DayForward"></span>':
                  width = ARROW_WIDTH;
                  break;
               case '<div class="controls-BreadCrumbsPath__breadCrumbs_home-path-spacing"></div>':
                  width = HOME_PATH_SPACING;
                  break;
               default:
                  width = backButtonWidth;
            }

            return width;
         };
         getMaxCrumbsWidth = BreadCrumbsUtil.getMaxCrumbsWidth;
         BreadCrumbsUtil.getMaxCrumbsWidth = function() {
            return maxCrumbsWidth;
         };
         calculateBreadCrumbsToDraw = BreadCrumbsUtil.calculateBreadCrumbsToDraw;
         BreadCrumbsUtil.calculateBreadCrumbsToDraw = function() {

         };
         getContainerSpacing = HeadingPath._private.getContainerSpacing;
         HeadingPath._private.getContainerSpacing = () => 12;
      }
      let stubFontLoadUtil;
      beforeEach(function() {
         stubFontLoadUtil = sinon.stub(FontLoadUtil, 'waitForFontLoad').callsFake(() => {
            return Deferred.success();
         });
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
         path = new HeadingPath();
         path.saveOptions({
            items: data.map(function(item) {
               return new entity.Model({
                  rawData: item
               });
            }),
            keyProperty: 'id',
            parentProperty: 'parent',
            root: null
         });
      });
      afterEach(function() {
         path = null;
         stubFontLoadUtil.restore();
      });
      describe('_afterMount', function() {
         afterEach(function() {
            getWidthUtil.getWidth = getWidth;
            BreadCrumbsUtil.getMaxCrumbsWidth = getMaxCrumbsWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw = calculateBreadCrumbsToDraw;
            HeadingPath._private.getContainerSpacing = getContainerSpacing;
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
            assert.equal(path._backButtonClass, 'controls-BreadCrumbsPath__backButton_short');
            assert.equal(path._breadCrumbsClass, 'controls-BreadCrumbsPath__breadCrumbs_long');
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
            assert.equal(path._backButtonClass, '');
            assert.equal(path._breadCrumbsClass, 'controls-BreadCrumbsPath__breadCrumbs_short');
         });
      });

      describe('_beforeUpdate', function() {
         afterEach(function() {
            BreadCrumbsUtil.getWidth = getWidth;
            BreadCrumbsUtil.getMaxCrumbsWidth = getMaxCrumbsWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw = calculateBreadCrumbsToDraw;
         });

         it('remove all items', function() {
            mockBreadCrumbsUtil(650, 650);
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

         it('container is hidden', function() {
            mockBreadCrumbsUtil(650, 650);
            path._visibleItems = [1, 2, 3];
            path._breadCrumbsItems = [2, 3];
            path._container = {
               clientWidth: 0
            };
            path._beforeUpdate({ items: path._options.items });

            assert.deepEqual(path._visibleItems, null);
            assert.deepEqual(path._breadCrumbsItems, null);
         });
      });

      it('_onBackButtonClick', function() {
         path._notify = function(e, args) {
            if (e === 'itemClick') {
               assert.equal(path._options.items[path._options.items.length - 2].get('parent'), args[0].get('parent'));
            }
         };
         path._onBackButtonClick({
            stopPropagation: function() {
            }
         });
      });

      it('_onHomeClick', function() {
         path._notify = function(e, args) {
            if (e === 'itemClick') {
               assert.equal(data[0].parent, args[0].get('id'));
            }
         };
         path._onHomeClick();
      });

      it('_onArrowClick', function() {
         var eventFired = false;
         path._notifyHandler = function(e) {
            if (e === 'arrowClick') {
               eventFired = true;
            }
         };
         path._notifyHandler('arrowClick');
         assert.isTrue(eventFired);
      });
   });

   describe('Controls.BreadCrumbs.Path', function() {

      var getWidth, getMaxCrumbsWidth, calculateBreadCrumbsToDraw, getContainerSpacing;

      const ARROW_WIDTH = 16;
      const BREAD_CRUMB_MIN_WIDTH = 36;
      const HOME_WIDTH = 36;
      const HOME_PATH_SPACING = 4;

      function mockBreadCrumbsUtil(backButtonWidth, maxCrumbsWidth) {
         getWidth = getWidthUtil.getWidth;
         getWidthUtil.getWidth = function(item) {
            let width;

            switch (item) {
               case '<div class="controls-BreadCrumbsPath__homeContainer"><div class="controls-BreadCrumbsPath__home icon-Home3"></div></div>':
                  width = HOME_WIDTH;
                  break;
               case '<div class="controls-BreadCrumbsView__title_min"></div>':
                  width = BREAD_CRUMB_MIN_WIDTH;
                  break;
               case '<span class="controls-BreadCrumbsView__arrow icon-size icon-DayForward"></span>':
                  width = ARROW_WIDTH;
                  break;
               case '<div class="controls-BreadCrumbsPath__breadCrumbs_home-path-spacing"></div>':
                  width = HOME_PATH_SPACING;
                  break;
               default:
                  width = backButtonWidth;
            }

            return width;
         };
         getMaxCrumbsWidth = BreadCrumbsUtil.getMaxCrumbsWidth;
         BreadCrumbsUtil.getMaxCrumbsWidth = function() {
            return maxCrumbsWidth;
         };
         calculateBreadCrumbsToDraw = BreadCrumbsUtil.calculateBreadCrumbsToDraw;
         BreadCrumbsUtil.calculateBreadCrumbsToDraw = function() {

         };
         getContainerSpacing = HeadingPath._private.getContainerSpacing;
         HeadingPath._private.getContainerSpacing = () => 12;
      }
      describe('resize notify', function() {
         afterEach(function() {
            BreadCrumbsUtil.getWidth = getWidth;
            BreadCrumbsUtil.getMaxCrumbsWidth = getMaxCrumbsWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw = calculateBreadCrumbsToDraw;
         });
         Path = Path.default;
         var data, path, data1;
         var resizeNotified = false;


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
         data1 = [
            {
               id: 1,
               title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
               parent: null
            }]
         path = new Path();
         path.saveOptions({
            items: data.map(function(item) {
               return new entity.Model({
                  rawData: item
               });
            }),
            keyProperty: 'id',
            parentProperty: 'parent',
            root: null
         });
         path._notify = function(e){
            if (e === 'controlResize') {
               resizeNotified = true;
            }
         }
         it ('onResize', function() {
            mockBreadCrumbsUtil(650, 650);
            path._oldWidth = 100;
            path._container = {
               clientWidth: 200
            }
            path._onResize();
            assert.isTrue(path._viewUpdated);
            path._afterUpdate();
            assert.isTrue(resizeNotified);
            resizeNotified = false;
         });
         it ('beforeUpdate', function() {
            mockBreadCrumbsUtil(650, 650);
            path._oldWidth = 100;
            path._container = {
               clientWidth: 100
            }
            path._beforeUpdate({
               items: data1.map(function(item) {
                  return new entity.Model({
                     rawData: item
                  });
               }),
               keyProperty: 'id',
               parentProperty: 'parent',
               root: null
            });
            assert.isTrue(path._viewUpdated);
            path._afterUpdate();
            assert.isTrue(resizeNotified);
            resizeNotified = false;
         });
      });

      BreadCrumbsUtil.calculateBreadCrumbsToDraw = calculateBreadCrumbsToDraw;
   });
});
