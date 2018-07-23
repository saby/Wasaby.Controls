define(
   [
      'Controls/Decorator/Number'
   ],
   function(Number) {

      'use strict';

      describe('Controls.Decorator.Number', function() {
         var result;

         it('Zero number', function() {
            result = Number._private.formatNumber(0);
            assert.equal(result, '0');
         });

         it('No fractionSize', function() {
            result = Number._private.formatNumber(10);
            assert.equal(result, '10');

            result = Number._private.formatNumber(10.01);
            assert.equal(result, '10.01');
         });

         it('Add fractional path', function() {
            result = Number._private.formatNumber(10, 2);
            assert.equal(result, '10.00');

            result = Number._private.formatNumber(10.0001, 0);
            assert.equal(result, '10');
         });

         it('Remove fractional path', function() {
            result = Number._private.formatNumber(10.123, 2);
            assert.equal(result, '10.12');
         });

         it('Divide into triads', function() {
            result = Number._private.formatNumber(123456.01);
            assert.equal(result, '123 456.01');

            result = Number._private.formatNumber(123456);
            assert.equal(result, '123 456');

            result = Number._private.formatNumber(123456.000001);
            assert.equal(result, '123 456.000001');

            result = Number._private.formatNumber(12345);
            assert.equal(result, '12 345');
         });

         it('Negative number', function() {
            result = Number._private.formatNumber(-123456.000001);
            assert.equal(result, '-123 456.000001');
         });
      });
   }
);
