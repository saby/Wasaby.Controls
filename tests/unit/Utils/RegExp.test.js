define(
   [
      'Controls/Utils/RegExp'
   ],
   function(RegExpUtil) {

      'use strict';
      describe('Controls.Utils.RegExp', function() {
         var result;

         describe('escapeSpecialChars', function() {
            it('Test_01', function() {
               result = RegExpUtil.escapeSpecialChars('');
               assert.equal(result, '');
            });
            it('Test_02', function() {
               result = RegExpUtil.escapeSpecialChars('123456789');
               assert.equal(result, '123456789');
            });
            it('Test_03', function() {
               result = RegExpUtil.escapeSpecialChars('\\1(2)3{4}5+6.7*8[9]');
               assert.equal(result, '\\\\1\\(2\\)3\\{4\\}5\\+6\\.7\\*8\\[9\\]');
            });
         });
      });
   }
);
