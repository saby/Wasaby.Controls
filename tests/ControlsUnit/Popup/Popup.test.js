define(
   [
      'Controls/_popup/Manager/Popup',
   ],

   function(PopupClass) {
      'use strict';

      describe('Controls/_popup/Popup', () => {
         it('isResized', () => {
            const Popup = new PopupClass.default();
            let oldOptions = { position: {} };
            let newOptions = { position: {} };
            assert.equal(false, Popup._isResized(oldOptions, newOptions));

            newOptions.position.width = 10;
            assert.equal(true, Popup._isResized(oldOptions, newOptions));

            oldOptions.position.width = 10;
            assert.equal(false, Popup._isResized(oldOptions, newOptions));

            oldOptions = { position: { height: 10 } };
            newOptions = { position: {} };
            assert.equal(true, Popup._isResized(oldOptions, newOptions));

            newOptions.position.height = 10;
            assert.equal(false, Popup._isResized(oldOptions, newOptions));

            oldOptions = { hidden: true, position: {} };
            newOptions = { hidden: false, position: {} };

            assert.equal(true, Popup._isResized(oldOptions, newOptions));
         });
      });
   }
);
