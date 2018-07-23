define(
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(BaseOpener) {

      'use strict';

      describe('Controls.Popup.Opener.BaseOpener', function() {
         it('updatePopupIds', function() {
            var updatePopupIds = BaseOpener._private.updatePopupIds;
            var popupIds = [1, 2, 3];

            updatePopupIds(popupIds, true, 'multiple');
            assert.deepEqual(popupIds, [1, 2, 3]);

            updatePopupIds(popupIds, false, 'multiple');
            assert.deepEqual(popupIds, [1, 2, 3]);

            updatePopupIds(popupIds, true, 'single');
            assert.deepEqual(popupIds, [1, 2, 3]);

            updatePopupIds(popupIds, false, 'single');
            assert.deepEqual(popupIds, []);
         });
      });
   }
);
