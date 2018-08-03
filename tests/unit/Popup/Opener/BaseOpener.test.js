define(
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(BaseOpener) {

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
      });
   }
);
