define(
   [
      'Controls/Input/Suggest',
      'WS.Data/Entity/Model'
   ],
   function(Suggest, Model) {
      'use strict';

      describe('Controls/Input/Suggest', function () {
   
         it('_onSearchEnd', function() {
            var suggest = new Suggest(),
                closed = false;
            
            suggest._children = {
               suggestPopupOpener: {
                  close: function() {
                     closed = true;
                  }
               }
            };
            
            suggest._focused = false;
            Suggest._private.onSearchEnd(suggest);
      
            assert.isTrue(closed, 'Popup is not closed after focusout and searching');
         });
         
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
                focused = false,
                selectedValue;
            
            suggest.saveOptions({
               displayProperty: 'title'
            });
            
            /* Т.к. реально проверить, есть ли фокус в саггесте мы не можем (нет DOM элемента),
               просто проверим вызов focus() */
            suggest.focus = function() {
               focused = true;
            };
            suggest.once('valueChanged', function(event, value) {
               selectedValue = value;
            });
   
            suggest._selectHandler(
               new Model(
                  {
                     rawData: {
                        title: 'test'
                     }
                  })
            );
   
            assert.isTrue(focused, 'Suggest is not focused after select');
            assert.equal(selectedValue, 'test',  'Wrong value after select');
         });
   
         it('_clearClick', function() {
            var suggest = new Suggest(),
                focused = false,
                suggestValue;
   
            suggest.focus = function() {
               focused = true;
            };
   
            suggest.once('valueChanged', function(event, value) {
               suggestValue = value;
            });
   
            Suggest._private.initSuggestController(suggest, {});
            suggest._clearClick();
   
   
            assert.equal(suggest._suggestController._value, '', 'Wrong value after clear');
            assert.equal(suggestValue, '', 'Wrong value after clear');
            assert.isTrue(focused, 'Suggest is not focused after clear');
         });
         
      });
      
   }
);