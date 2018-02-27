define(
   [
      'Controls/Input/resources/InputRender/SimpleViewModel'
   ],
   function(SimpleViewModel) {

      'use strict';

      describe('Controls.Input.SimpleViewModel', function() {
         it('Simle test', function () {
            var
               inputResult;
            inputResult = new SimpleViewModel({
            }).prepareData(
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