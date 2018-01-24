define(
   [
      'Controls/Input/Suggest'
   ],
   function(Suggest) {
      'use strict';

      describe('Controls/Input/Suggest', function () {
         
         it('_popupFocusIn', function() {
            var suggest = new Suggest();
   
            suggest._popupFocusIn();
   
            assert.isTrue(suggest._popupFocused);
         });
   
         it('_popupFocusOut', function() {
            var suggest = new Suggest();
   
            suggest._popupFocusOut({});
            
            assert.isFalse(suggest._popupFocused);
         });
   
         it('_private.needCloseOnFocusOut', function() {
            var suggest = new Suggest();
   
            suggest._popupFocusIn();
            assert.isFalse(Suggest._private.needCloseOnFocusOut(suggest));
   
            suggest._popupFocusOut({});
            assert.isTrue(Suggest._private.needCloseOnFocusOut(suggest));
         });
         
      });
      
   }
);