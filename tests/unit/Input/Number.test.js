define(
   [
      'Controls/Input/Number'
   ],
   function(NumberInput) {
      'use strict';

      describe('Controls.Input.Number', function() {
         it('trimEmptyDecimals ("000" at the end of string)', function() {
            var
               res;
            NumberInput._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
                     return '123.000';
                  },
                  getDisplayValue: function() {
                     return '123.000';
                  },
                  updateValue: function(processedVal) {
                     res = processedVal;
                  }
               }
            }, {});

            assert.equal(res, '123');
         });

         it('trimEmptyDecimals ("." at the end of string)', function() {
            var
               res;
            NumberInput._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
                     return '123.';
                  },
                  getDisplayValue: function() {
                     return '123.';
                  },
                  updateValue: function(processedVal) {
                     res = processedVal;
                  }
               }
            }, {});

            assert.equal(res, '123');
         });

         it('trimEmptyDecimals ("456" at the end of string)', function() {
            var
               res;
            NumberInput._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
                     return '123.456';
                  },
                  getDisplayValue: function() {
                     return '123.456';
                  },
                  updateValue: function(processedVal) {
                     res = processedVal;
                  }
               }
            }, {});

            assert.equal(res, '123.456');
         });

         it('trim minus if value -0', function() {
            var config = {
               onlyPositive: false,
               integersLength: 5,
               precision: 0,
               showEmptyDecimals: true,
               value: null
            };
            let num = new NumberInput(config);
            num._beforeMount(config);
            num._options.precision = 0;

            num._inputCompletedHandler({}, '-0');
            assert.equal(num._numberViewModel.getValue(), '0');
         });

         it('trimEmptyDecimals (single zero, no dot)', function() {
            var
               res;
            NumberInput._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
                     return '0';
                  },
                  getDisplayValue: function() {
                     return '0';
                  },
                  updateValue: function(processedVal) {
                     res = processedVal;
                  }
               }
            }, {});

            assert.equal(res, '0');
         });
         it('_beforeMount( value null)', function() {
            var config = {
               value: null
            };
            let num = new NumberInput(config);
            num._beforeMount(config);
            assert.equal(num._numberViewModel.getDisplayValue(), '');
         });
      });
   }
);
