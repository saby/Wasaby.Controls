define(
   [
      'Controls/Input/Number'
   ],
   function(Number) {

      'use strict';

      describe('Controls.Input.Number', function() {
         it('trimEmptyDecimals', function() {
            var
               res;
            Number._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
                     return '123.000';
                  },
                  updateValue: function(processedVal) {
                     res = processedVal;
                  }
               }
            });

            assert.equal(res, '123');
         });
      });
   }
);
