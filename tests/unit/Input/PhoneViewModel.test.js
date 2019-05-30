define(
   [
      'Controls/_input/Phone/ViewModel'
   ],
   function(ViewModel) {

      'use strict';

      describe('Controls.Input.Phone.ViewModel', function() {
         var model;
         it('isFilled', function() {
            model = new ViewModel({}, '123');
            assert.equal(model.isFilled(), false);

            model = new ViewModel({}, '1234');
            assert.equal(model.isFilled(), true);

            model = new ViewModel({}, '12345');
            assert.equal(model.isFilled(), true);

            model = new ViewModel({}, '123456');
            assert.equal(model.isFilled(), true);
         });

         describe('handleInput', function() {
            [{
               inputType: 'insert',
               splitValue: {
                  after: '',
                  before: '',
                  delete: '',
                  insert: '8-916-865-43-21'
               },
               respValue: '89168654321',
               respDisplayValue: '8 (916) 865-43-21'
            }].forEach(function(test, testNumber) {
               it(`${test.inputType} ${testNumber}`, function() {
                  const
                     model = new ViewModel({}, '');
                  model.handleInput(test.splitValue, test.inputType);
                  assert.equal(model.value, test.respValue);
                  assert.equal(model.displayValue, test.respDisplayValue);
               });
            });
         });
      });
   }
);
