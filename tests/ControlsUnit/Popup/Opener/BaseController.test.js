define(
   [
      'Controls/_popupTemplate/BaseController'
   ],
   (BaseController) => {
      'use strict';
      describe('Controls/_popupTemplate/BaseController', () => {
         it('Controller popup sizes', () => {
            let BCInstacne = new BaseController();
            let margins = {
               top: 1,
               left: 2,
            };
            BCInstacne._private.getFakeDivMargins = () => margins;
            let config = {
               popupOptions: {
                  maxWidth: 200,
                  width: 150,
                  maxHeight: 200
               }
            };

            let container = {
               offsetWidth: 100,
               offsetHeight: 100
            };

            BCInstacne._getPopupSizes(config, container);
            assert.equal(config.sizes.width, 150);
            assert.equal(config.sizes.height, 100);
            assert.equal(config.sizes.margins.top, 0);
            assert.equal(config.sizes.margins.left, 0);

            config.popupOptions.className = '1';
            BCInstacne._getPopupSizes(config, container);
            assert.equal(config.sizes.margins.top, 1);
            assert.equal(config.sizes.margins.left, 2);

            margins = {
               top: 3,
               left: 4,
            };

            BCInstacne._getPopupSizes(config, container);
            assert.equal(config.sizes.margins.top, 1);
            assert.equal(config.sizes.margins.left, 2);

            config.popupOptions = {};

            BCInstacne._getPopupSizes(config, container);

            assert.equal(config.sizes.width, 100);
            assert.equal(config.sizes.height, 100);
            assert.equal(config.sizes.margins.top, 3);
            assert.equal(config.sizes.margins.left, 4);
         });
      });
   }
);
