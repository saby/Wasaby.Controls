define(
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   (BaseOpener) => {

      'use strict';

      describe('Controls/Popup/Opener/BaseOpener', () => {
         it('clearPopupIds', () => {
            let clearPopupIds = BaseOpener._private.clearPopupIds;
            let popupIds = [1, 2, 3];

            clearPopupIds(popupIds, true, 'multiple');
            assert.deepEqual(popupIds, [1, 2, 3]);

            clearPopupIds(popupIds, false, 'multiple');
            assert.deepEqual(popupIds, [1, 2, 3]);

            clearPopupIds(popupIds, true, 'single');
            assert.deepEqual(popupIds, [1, 2, 3]);

            clearPopupIds(popupIds, false, 'single');
            assert.deepEqual(popupIds, []);
         });

         it('registerOpenerUpdateCallback', () => {
            let opener = new BaseOpener();
            opener._notify = (eventName, args) => {
               assert.equal(eventName, 'registerOpenerUpdateCallback');
               assert.equal(typeof args[0], 'function');
            };
            opener._afterMount();
            opener._notify = () => {};
            opener.destroy();
         });

         it('_beforeUnmount', () => {
            let opener = new BaseOpener();
            let isHideIndicatorCall = false;
            opener._indicatorId = '123';

            opener._notify = (eventName, args) => {
               if (eventName === 'hideIndicator') {
                  isHideIndicatorCall = true;
               }
            };

            opener._beforeUnmount();
            assert.equal(opener._indicatorId, null);
            assert.equal(isHideIndicatorCall, true);
            opener.destroy();
         });
      });
   }
);
