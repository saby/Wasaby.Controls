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
            var suggest = new Suggest(),
                aborted = false;
            
            suggest._suggestController = {};
            suggest._suggestController.abort = function() {
               aborted = true;
            };
            
            suggest._popupFocusOut({to: suggest});
            assert.isFalse(aborted);
            assert.isFalse(suggest._popupFocused);
            
            suggest._popupFocusOut({to: {}});
            assert.isTrue(aborted);
            assert.isFalse(suggest._popupFocused);
         });
   
         it('_private.needCloseOnFocusOut', function() {
            var suggest = new Suggest();
   
            suggest._popupFocusIn();
            assert.isFalse(Suggest._private.needCloseOnFocusOut(suggest));
   
            suggest._popupFocusOut({});
            assert.isTrue(Suggest._private.needCloseOnFocusOut(suggest));
         });
   
         it('_beforeUpdate', function() {
            var suggest = new Suggest();
      
            suggest._beforeUpdate({value: '123'});
            assert.equal(suggest._simpleViewModel.getValue(), '123');
         });
   
         it('selectHandler', function() {
            //тестирует фокусы, проверяем только на клиенте
            if (typeof document === 'undefined') {
               this.skip();
            }
            var suggest = new Suggest(),
                focused = false,
                selectedValue;
            
            suggest.saveOptions({
               displayProperty: 'title'
            });
            
            /* Т.к. реально проверить, есть ли фокус в саггесте мы не можем (нет DOM элемента),
               просто проверим вызов focus() */
            /* Защита от изменения API, чтобы если api изменят, тест упал */
            if (suggest.activate) {
               suggest.activate = function () {
                  focused = true;
               };
            }
            suggest._notify = function(eventName, value) {
               if (eventName === 'valueChanged') {
                  selectedValue = value;
               }
            };
   
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
            //тестирует клик, проверяем только на клиенте
            if (typeof document === 'undefined') {
               this.skip();
            }
            var suggest = new Suggest(),
                focused = false,
                suggestValue;
   
            /* Защита от изменения API, чтобы если api изменят, тест упал */
            if (suggest.activate) {
               suggest.activate = function () {
                  focused = true;
               };
            }
   
            suggest._notify = function(eventName, value) {
               if (eventName === 'valueChanged') {
                  suggestValue = value;
               }
            };
   
            Suggest._private.initSuggestController(suggest, {});
            suggest._clearClick();
   
   
            assert.equal(suggest._suggestController._value, '', 'Wrong value after clear');
            assert.equal(suggestValue, '', 'Wrong value after clear');
            assert.isTrue(focused, 'Suggest is not focused after clear');
         });
         
      });
      
   }
);