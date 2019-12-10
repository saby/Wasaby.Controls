define([
   'Controls/_breadcrumbs/HeadingPath',
   'Controls/_breadcrumbs/Path',
   'Controls/_breadcrumbs/Utils',
   'Controls/Utils/FontLoadUtil',
   'Core/Deferred',
   'Types/entity'
], function(
   HeadingPath,
   Path,
   BreadCrumbsUtil,
   FontLoadUtil,
   Deferred,
   entity
) {
   describe('Controls.BreadCrumbs.HeadingPath', function() {
      HeadingPath = HeadingPath.default;
      BreadCrumbsUtil = BreadCrumbsUtil.default;

      var path, data, drawBreadCrumbs;

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
            BreadCrumbsUtil.drawBreadCrumbs = drawBreadCrumbs;
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

      var drawBreadCrumbs;
         drawBreadCrumbs = BreadCrumbsUtil.drawBreadCrumbs;
         BreadCrumbsUtil.drawBreadCrumbs = function() {

         };

      BreadCrumbsUtil.drawBreadCrumbs = drawBreadCrumbs;
   });
});
