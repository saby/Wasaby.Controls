define(
   [
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Opener/Dialog',
      'Controls/Popup/Opener/Stack'
   ],
   function(BaseOpener, Dialog, Stack) {

      'use strict';

      describe('Controls.Popup.Opener.BaseOpener', function() {
         it('clearPopupIds', function() {
            var clearPopupIds = BaseOpener._private.clearPopupIds;
            var popupIds = [1, 2, 3];

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
      });


      describe('Controls.Popup.Opener.Dialog', () => {
         it('getConfig', () => {
            let getDialogConfig = Dialog._private.getDialogConfig;
            let config = getDialogConfig();
            assert.equal(config.isDefaultOpener, true);

            config = getDialogConfig({isDefaultOpener: false});
            assert.equal(config.isDefaultOpener, false);
         });
      });

      describe('Controls.Popup.Opener.Stack', () => {
         it('getConfig', () => {
            let getStackConfig = Stack._private.getStackConfig;
            let config = getStackConfig();
            assert.equal(config.isDefaultOpener, true);

            config = getStackConfig({isDefaultOpener: false});
            assert.equal(config.isDefaultOpener, false);
         });
      });
   }
);
