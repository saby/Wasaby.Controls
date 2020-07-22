define(
   [
      'Controls/_popupTemplate/Sticky/StickyStrategy',
   ],
   (StickyStrategy) => {
      'use strict';

      describe('visualViewPort', () => {

         it('checkOverflow', () => {
            let getWindowSizes = StickyStrategy._private.getWindowSizes;
            let getVisualViewPort = StickyStrategy._private.getVisualViewport;
            StickyStrategy._private.getVisualViewport = () => ({
               width: 1000,
               offsetLeft: 0,
               pageLeft: 80
            });
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1024,
               height: 1040
            });
            let targetCoords = {
               left: 989,
               leftScroll: 0
            };
            let popupCfg = {
               sizes: {
                  width: 120
               }
            };
            let position = {
               left: 989
            };

            let overflow = StickyStrategy._private.checkOverflow(popupCfg, targetCoords, position, 'horizontal');
            assert.strictEqual(overflow, 85);

            StickyStrategy._private.getWindowSizes = getWindowSizes;
            StickyStrategy._private.getVisualViewport = getVisualViewPort;
         });
      });
   }
);
