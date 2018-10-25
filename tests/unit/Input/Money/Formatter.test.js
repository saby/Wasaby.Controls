define(
   [
      'Controls/Input/Money/Formatter'
   ],
   function(Formatter) {

      'use strict';

      describe('Controls.Input.Money.Formatter', function() {
         describe('toNumber', function() {
            var tests = [
               {
                  value: '0',
                  result: {
                     integer: '0',
                     fraction: ''
                  }
               },
               {
                  value: '0.1',
                  result: {
                     integer: '0',
                     fraction: '1'
                  }
               },
               {
                  value: '123',
                  result: {
                     integer: '123',
                     fraction: ''
                  }
               },
               {
                  value: '123.000',
                  result: {
                     integer: '123',
                     fraction: '000'
                  }
               },
               {
                  value: '123.123',
                  result: {
                     integer: '123',
                     fraction: '123'
                  }
               },
               {
                  value: '123 рубля, 123 копейки.',
                  result: {
                     integer: '123',
                     fraction: '123'
                  }
               },
               {
                  value: '000123.000123',
                  result: {
                     integer: '123',
                     fraction: '000123'
                  }
               },
               {
                  value: '123,123',
                  result: {
                     integer: '123',
                     fraction: '123'
                  }
               }
            ];

            tests.forEach(function(test) {
               it('Test value equal to "' + test.value + '"', function() {
                  assert.deepEqual(Formatter.toNumber(test.value), test.result);
               });
            });
         });
      });
   }
);
