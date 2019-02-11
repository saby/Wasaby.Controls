define(
   [
      'Controls/Input/Phone/ViewModel'
   ],
   function(ViewModel) {

      'use strict';

      describe('Controls.Input.Phone.ViewModel', function() {
         var model;
         it('isFilled', function() {
            model = new ViewModel({
               value: '123'
            });
            assert.equal(model.isFilled(), false);

            model = new ViewModel({
               value: '1234'
            });
            assert.equal(model.isFilled(), true);

            model = new ViewModel({
               value: '12345'
            });
            assert.equal(model.isFilled(), true);

            model = new ViewModel({
               value: '123456'
            });
            assert.equal(model.isFilled(), true);
         });
         it('valueValidate', function() {
            var options = { value: null };
            model = new ViewModel(options);
            ViewModel._private.valueValidate(options);
            assert.equal(options.value, '');
         });
      });
   }
);
