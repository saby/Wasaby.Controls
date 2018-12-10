define(
   [
      'Controls/Decorator/Money'
   ],
   function(Money) {

      'use strict';

      describe('Controls.Decorator.Money', function() {
         var result;

         it('parseNumber', function() {
            result = Money._private.parseNumber(20, false);
            assert.deepEqual(result, {
               number: '20.00',
               integer: '20',
               fraction: '.00'
            });

            result = Money._private.parseNumber(20.1, false);
            assert.deepEqual(result, {
               number: '20.10',
               integer: '20',
               fraction: '.10'
            });

            result = Money._private.parseNumber(20.18, false);
            assert.deepEqual(result, {
               number: '20.18',
               integer: '20',
               fraction: '.18'
            });

            result = Money._private.parseNumber(20.181, false);
            assert.deepEqual(result, {
               number: '20.18',
               integer: '20',
               fraction: '.18'
            });

            result = Money._private.parseNumber(Infinity, false);
            assert.deepEqual(result, {
               number: '0.00',
               integer: '0',
               fraction: '.00'
            });

            result = Money._private.parseNumber(1000.00, false);
            assert.deepEqual(result, {
               number: '1000.00',
               integer: '1000',
               fraction: '.00'
            });

            result = Money._private.parseNumber(1000.00, true);
            assert.deepEqual(result, {
               number: '1 000.00',
               integer: '1 000',
               fraction: '.00'
            });

            result = Money._private.parseNumber(-1000.00, false);
            assert.deepEqual(result, {
               number: '-1000.00',
               integer: '-1000',
               fraction: '.00'
            });

            result = Money._private.parseNumber(-1000.00, true);
            assert.deepEqual(result, {
               number: '-1 000.00',
               integer: '-1 000',
               fraction: '.00'
            });
         });
      });
   }
);
