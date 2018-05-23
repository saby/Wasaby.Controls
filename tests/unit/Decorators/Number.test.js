define(
   [
      'Controls/Decorators/Number'
   ],
   function(Number) {

      'use strict';

      describe('Controls.Decorators.Number', function() {
         var result;

         it('No fractionSize 1.', function() {
            result = Number._private.formatNumber(10);
            assert.equal(result, '10');
         });

         it('No fractionSize 2.', function() {
            result = Number._private.formatNumber(10.01);
            assert.equal(result, '10.01');
         });

         it('Add fractional path', function() {
            result = Number._private.formatNumber(10.0001, 0);
            assert.equal(result, '10');
         });

         it('Add fractional path', function() {
            result = Number._private.formatNumber(10, 2);
            assert.equal(result, '10.00');
         });

         it('Remove fractional path', function() {
            result = Number._private.formatNumber(10.123, 2);
            assert.equal(result, '10.12');
         });

         it('Remove fractional path', function() {
            result = Number._private.formatNumber(123456.01);
            assert.equal(result, '123 456.01');
         });

         it('Remove fractional path', function() {
            result = Number._private.formatNumber(123456);
            assert.equal(result, '123 456');
         });

         it('Remove fractional path', function() {
            result = Number._private.formatNumber(123456.000001);
            assert.equal(result, '123 456.000001');
         });

         it('Remove fractional path', function() {
            result = Number._private.formatNumber(12345);
            assert.equal(result, '12 345');
         });
      });
   }
);