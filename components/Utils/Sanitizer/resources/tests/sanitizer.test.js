/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Utils.Sanitizer'
   ], function (Sanitizer) {
      'use strict';

      describe('SBIS3.CONTROLS.Utils.Sanitizer', function() {
         var
            htmlClear,
            content;

         beforeEach(function() {
            htmlClear = new Sanitizer();
            content = '';
         });

         afterEach(function() {
            htmlClear = undefined;
            content = undefined;
         });

         describe('.clear()', function() {
            it('should return empty string if content have just script', function() {
               content = '<script>alert(1)</script>';
               assert.equal(htmlClear.clear(content), '');
            });
            it('not remove special symbols', function() {
               content = '&nbsp; &iexcl; &cent; &pound; &curren; &yen; $brvbar; &sect; &uml; &copy;';
               assert.equal(htmlClear.clear(content), content);
            });
            it('not remove line break symbols', function() {
               content = 'test' + String.fromCharCode(10) + 'test';
               assert.equal(htmlClear.clear(content), content);
               content = 'test\ntest';
               assert.equal(htmlClear.clear(content), content);
            });
            it('not save onclick', function() {
               content = '<div onclick="alert(1);">123</div>';
               assert.equal(htmlClear.clear(content), '<div>123</div>');
            });
            it('save onclick', function() {
               content = '<div onclick="alert(1);">123</div>';
               htmlClear = new Sanitizer({extended_valid_elements: 'div[onclick]'});
               assert.equal(htmlClear.clear(content), content);
            });
            it('save style', function() {
               content = '<div style="margin:20px">123</div>';
               assert.equal(htmlClear.clear(content), content);
            });
            it('remove all attributes in div', function() {
               content = '<div style="margin:20px" onclick="alert(1)" width="100" class="myclass" >123</div>';
               htmlClear = new Sanitizer({extended_valid_elements: 'div'});
               assert.equal(htmlClear.clear(content), '<div>123</div>');
            });
            it('save script', function() {
               content = '<script>alert(1)</script>';
               htmlClear = new Sanitizer({extended_valid_elements: 'script'});
               assert.equal(htmlClear.clear(content), content);
            });
            it('remove not valid attribute', function() {
               content = '<div stylesss="margin:20px">123</div>';
               assert.equal(htmlClear.clear(content), '<div>123</div>');
            });
         });
      });
   }
);
