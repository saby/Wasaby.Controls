define(
   [
      'Controls/Utils/splitIntoTriads'
   ],
   function(splitIntoTriads) {

      'use strict';

      describe('Controls.Utils.splitIntoTriads', function() {
         it('Tests', function() {
            assert.equal(splitIntoTriads.default('1'), '1');
            assert.equal(splitIntoTriads.default('11'), '11');
            assert.equal(splitIntoTriads.default('111'), '111');
            assert.equal(splitIntoTriads.default('1111'), '1 111');
            assert.equal(splitIntoTriads.default('11111'), '11 111');
            assert.equal(splitIntoTriads.default('111111'), '111 111');
            assert.equal(splitIntoTriads.default('-111'), '-111');
            assert.equal(splitIntoTriads.default('-111111'), '-111 111');
         });
      });
   }
);
