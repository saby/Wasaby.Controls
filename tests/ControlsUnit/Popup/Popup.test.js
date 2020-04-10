define(
   [
      'Controls/_popup/Manager/Popup',
   ],

   function(PopupClass) {
      'use strict';

      describe('Controls/_popup/Manager/Popup', () => {
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
         it('reseize Outer', (done) => {
            const Popup = new PopupClass.default();
            let wasUpdate = false;
            let callOpenersUpdate = Popup._callOpenersUpdate;
            Popup._callOpenersUpdate = () => { wasUpdate = true; assert.equal(wasUpdate, true); done();};
            Popup._controlResizeOuterHandler();
            Popup._callOpenersUpdate = callOpenersUpdate;
         });
      });
   }
);
