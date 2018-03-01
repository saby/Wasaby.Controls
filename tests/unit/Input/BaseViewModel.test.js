define(
   [
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(BaseViewModel) {

      'use strict';

      describe('Controls.Input.BaseViewModel', function() {
         it('handleInput', function () {
            var
               inputResult;
            inputResult = new BaseViewModel({
            }).handleInput(
               {
                  before: '12',
                  insert: 'a',
                  after: '',
                  delete: ''
               }
            );
            assert.equal(inputResult.value, '12a');
            assert.equal(inputResult.position, 3);
         });
      });
   }
);