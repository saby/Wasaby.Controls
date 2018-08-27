define(
   [
      'Controls/Input/Number'
   ],
   function(Number) {

      'use strict';

      describe('Controls.Input.Number', function() {
         it('trimEmptyDecimals ("000" at the end of string)', function() {
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
            }, {});

            assert.equal(res, '123');
         });

         it('trimEmptyDecimals ("." at the end of string)', function() {
            var
               res;
            Number._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
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
            Number._private.trimEmptyDecimals({
               _options: {
                  showEmptyDecimals: false
               },
               _numberViewModel: {
                  getValue: function() {
                     return '123.456';
                  },
                  updateValue: function(processedVal) {
                     res = processedVal;
                  }
               }
            }, {});

            assert.equal(res, '123.456');
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
            }, {});

            assert.equal(res, '0');
         });
      });
   }
);
