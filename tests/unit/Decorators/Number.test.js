define(
   [
      'Controls/Decorators/Number'
   ],
   function(Number) {

      'use strict';

      describe('Controls.Decorators.Number', function() {
         var result;

         it('Without fractional sizes', function() {
            result = Number(10);
            assert.equal(result, '10');
         });
         it('Add fractional path', function() {
            result = Number(10, 2);
            assert.equal(result, '10.00');
         });
         it('Remove fractional path', function() {
            result = Number(10.123, 2);
            assert.equal(result, '10.12');
         });
      });
   }
);