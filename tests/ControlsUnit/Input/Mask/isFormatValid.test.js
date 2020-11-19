define([
      'Controls/input'
   ],
   function(input) {
      'use strict';

      describe('Controls/input:isMaskFormatValid', function() {
         const isMaskFormatValid = input.isMaskFormatValid;

         it('Valid value. Invalid mask.', function() {
            const actual = isMaskFormatValid('', 'd(d.d)d)');
            assert.isFalse(actual);
         });
         it('Invalid value. Valid mask.', function() {
            const actual = isMaskFormatValid('1a.a1', 'dd.dd');
            assert.isFalse(actual);
         });
         it('Valid value. Valid mask.', function() {
            const actual = isMaskFormatValid('12.21', 'dd.dd');
            assert.isTrue(actual);
         });
      });
   });
