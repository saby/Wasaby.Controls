define(
   [
      'Controls/decorator'
   ],
   function(decorator) {

      'use strict';

      describe('Controls.Decorator.Number', function() {
         var result;

         it('Zero number', function() {
            result = decorator.Number._private.formatNumber(0, 'round');
            assert.equal(result, '0');
         });

         it('No fractionSize', function() {
            result = decorator.Number._private.formatNumber(10, 'round');
            assert.equal(result, '10');

            result = decorator.Number._private.formatNumber(10.01, 'round');
            assert.equal(result, '10.01');
         });

         it('Add fractional path', function() {
            result = decorator.Number._private.formatNumber(10, 'round' , 2);
            assert.equal(result, '10.00');

            result = decorator.Number._private.formatNumber(10.0001, 'round' , 0);
            assert.equal(result, '10');
         });

         it('Remove fractional path', function() {
            result = decorator.Number._private.formatNumber(10.123, 'round' , 2);
            assert.equal(result, '10.12');
         });

         it('Divide into triads', function() {
            result = decorator.Number._private.formatNumber(123456.01, 'round', undefined, true);
            assert.equal(result, '123 456.01');

            result = decorator.Number._private.formatNumber(123456, 'round', undefined, true);
            assert.equal(result, '123 456');

            result = decorator.Number._private.formatNumber(123456.000001, 'round', undefined, true);
            assert.equal(result, '123 456.000001');

            result = decorator.Number._private.formatNumber(12345, 'round', undefined, true);
            assert.equal(result, '12 345');
         });

         it('Negative number', function() {
            result = decorator.Number._private.formatNumber(-123456.000001, 'round', undefined, true);
            assert.equal(result, '-123 456.000001');
         });

         it('Mode trunc', function() {
            result = decorator.Number._private.formatNumber(1.234567890, 'trunc', 4);
            assert.equal(result, '1.2345');

            result = decorator.Number._private.formatNumber(1.234567890, 'trunc', 0);
            assert.equal(result, '1');
         });
      });
   }
);
