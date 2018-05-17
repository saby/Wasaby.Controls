define(
   [
      'Controls/Decorators/Money'
   ],
   function(Money) {

      'use strict';

      describe('Controls.Decorators.Money', function() {
         var result;

         it('getParseNumber', function() {
            result = Money._private.getParseNumber(20);
            assert.deepEqual(result, {
               number: '20.00',
               integer: '20',
               fraction: '.00'
            });

            result = Money._private.getParseNumber(20.1);
            assert.deepEqual(result, {
               number: '20.10',
               integer: '20',
               fraction: '.10'
            });

            result = Money._private.getParseNumber(20.18);
            assert.deepEqual(result, {
               number: '20.18',
               integer: '20',
               fraction: '.18'
            });

            result = Money._private.getParseNumber(20.181);
            assert.deepEqual(result, {
               number: '20.18',
               integer: '20',
               fraction: '.18'
            });

            result = Money._private.getParseNumber(Infinity);
            assert.deepEqual(result, {
               number: '0.00',
               integer: '0',
               fraction: '.00'
            });
         });
      });
   }
);