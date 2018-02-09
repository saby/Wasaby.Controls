define(
   [
      'Controls/Input/Suggest',
      'WS.Data/Entity/Model'
   ],
   function(Suggest, Model) {
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
   
         it('selectHandler', function() {
            var suggest = new Suggest(),
                focused = false;
            
            /* Т.к. реально проверить, есть ли фокус в саггесте мы не можем (нет DOM элемента),
               просто проверим вызов focus() */
            suggest.focus = function() {
               focused = true;
            };
            suggest._selectHandler(new Model());
            
            assert.isTrue(focused, 'Suggest is not focused after select');
         });
         
      });
      
   }
);