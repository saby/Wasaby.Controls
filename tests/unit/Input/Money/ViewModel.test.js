define(
   [
      'Controls/_input/Money/ViewModel'
   ],
   function(ViewModel) {
      'use strict';

      describe('Controls.Input.Money', function() {
         var model = new ViewModel({
            precision: 2,
            useGrouping: true,
            onlyPositive: false,
            showEmptyDecimals: true,
            useAdditionToMaxPrecision: true
         }, null);

         describe('Change the value.', function() {
            it('0', function() {
               model.value = '0';

               assert.equal(model.value, '0');
               assert.equal(model.displayValue, '0.00');
            });
            it('0.1', function() {
               model.value = '0.1';

               assert.equal(model.value, '0.1');
               assert.equal(model.displayValue, '0.10');
            });
            it('0.12', function() {
               model.value = '0.12';

               assert.equal(model.value, '0.12');
               assert.equal(model.displayValue, '0.12');
            });
            it('123456', function() {
               model.value = '123456';

               assert.equal(model.value, '123456');
               assert.equal(model.displayValue, '123 456.00');
            });
         });
         describe('Change the display value.', function() {
            it('0.00', function() {
               model.displayValue = '0.00';

               assert.equal(model.value, '0');
               assert.equal(model.displayValue, '0.00');
            });
            it('0.10', function() {
               model.displayValue = '0.10';

               assert.equal(model.value, '0.1');
               assert.equal(model.displayValue, '0.10');
            });
            it('0.12', function() {
               model.displayValue = '0.12';

               assert.equal(model.value, '0.12');
               assert.equal(model.displayValue, '0.12');
            });
            it('123 456.00', function() {
               model.displayValue = '123 456.00';

               assert.equal(model.value, '123456');
               assert.equal(model.displayValue, '123 456.00');
            });
         });
      });
   }
);
