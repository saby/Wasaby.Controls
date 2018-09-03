define(
   [
      'Controls/Decorator/Number'
   ],
   function(Number) {

      'use strict';

      describe('Controls.Decorator.Number', function() {
         var result;

         it('Zero number', function() {
            result = Number._private.formatNumber(0, 'round');
            assert.equal(result, '0');
         });

         it('No fractionSize', function() {
            result = Number._private.formatNumber(10, 'round');
            assert.equal(result, '10');

            result = Number._private.formatNumber(10.01, 'round');
            assert.equal(result, '10.01');
         });

         it('Add fractional path', function() {
            result = Number._private.formatNumber(10, 'round' , 2);
            assert.equal(result, '10.00');

            result = Number._private.formatNumber(10.0001, 'round' , 0);
            assert.equal(result, '10');
         });

         it('Remove fractional path', function() {
            result = Number._private.formatNumber(10.123, 'round' , 2);
            assert.equal(result, '10.12');
         });

         it('Divide into triads', function() {
            result = Number._private.formatNumber(123456.01, 'round');
            assert.equal(result, '123 456.01');

            result = Number._private.formatNumber(123456, 'round');
            assert.equal(result, '123 456');

            result = Number._private.formatNumber(123456.000001, 'round');
            assert.equal(result, '123 456.000001');

            result = Number._private.formatNumber(12345, 'round');
            assert.equal(result, '12 345');
         });

         it('Negative number', function() {
            result = Number._private.formatNumber(-123456.000001, 'round');
            assert.equal(result, '-123 456.000001');
         });

         it('Mode trunc', function() {
            result = Number._private.formatNumber(1.234567890, 'trunc', 4);
            assert.equal(result, '1.2345');

            result = Number._private.formatNumber(1.234567890, 'trunc', 0);
            assert.equal(result, '1');
         });
      });
   }
);
