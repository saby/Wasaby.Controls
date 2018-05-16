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
         it('trimEmptyDecimals (single zero, no dot)', function() {
            var
               res;
            Number._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
                     return '0';
                  },
                  updateValue: function(processedVal) {
                     res = processedVal;
                  }
               }
            });

            assert.equal(res, '0');
         });

         it('Show nothing on focusIn if field is empty', function() {
            var
               number = new Number({
                  value: ''
               });

            number._focusinHandler();

            assert.equal(number._numberViewModel.getValue(), '');

         });

         it('Add ".0" on focusIn if field is not empty and has no dot', function() {
            var
               number = new Number({
                  value: '1'
               });

            number._focusinHandler();

            assert.equal(number._numberViewModel.getValue(), '1.0');

         });

         it('Add nothing on focusIn if field is not empty but already has dot', function() {
            var
               number = new Number({
                  value: '1.2'
               });

            number._focusinHandler();

            assert.equal(number._numberViewModel.getValue(), '1.2');

         });
      });
   }
);
