/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['SBIS3.CONTROLS/NumberTextBox/resources/FormatText'], function(FormatText) {
   'use strict';

   describe('SBIS3.CONTROLS/NumberTextBox/resources/FormatText', function() {
      beforeEach(function() {
      });
      describe('formatText', function() {
         // value, text, onlyInteger, decimals, integers, delimiters, onlyPositive, maxLength, hideEmptyDecimals
         it('"-" -> "-"', function() {
            assert.equal(FormatText.formatText('-', '123', false, 4, 5, false, false, 16, false), '-');
         });
         it('"." -> "."', function() {
            assert.equal(FormatText.formatText('.', '123', false, 4, 5, false, false, 16, false), '.');
         });
         it('html -> 10.1000', function() {
            assert.equal(FormatText.formatText('<span lang="EN-US" style="font-size:72.0pt;line-height:\n\
                        115%;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;mso-ascii-theme-font:minor-latin;\n\
                        mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;mso-hansi-theme-font:\n\
                        minor-latin;mso-bidi-font-family:Aharoni;mso-ansi-language:EN-US;mso-fareast-language:\n\
                        EN-US;mso-bidi-language:AR-SA">10.</span><span lang="EN-US" style="font-size:\n\
                        11.0pt;line-height:115%;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;mso-ascii-theme-font:\n\
                        minor-latin;mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;\n\
                        mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Aharoni;mso-ansi-language:\n\
                        EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA">1</span>', '123', false, 4, 5, false, false, 16, false), '10.1000');
         });
         it('onlyInteger = true: 123.45 -> 123', function() {
            assert.equal(FormatText.formatText('123.45', '123', true, 4, 5, false, false, 16, true), '123');
         });
         it('decimals = 0: 123.45 -> 123', function() {
            assert.equal(FormatText.formatText('123.45', '123', false, 0, 5, false, false, 16, true), '123');
         });
         it('decimals = -1: 123.4567891 -> 123.456', function() {
            assert.equal(FormatText.formatText('123.4567891', '123', false, -1, 5, false, false, 16, true), '123.4567891');
         });
         it('decimals = 3: 123.4567891 -> 123.4567891', function() {
            assert.equal(FormatText.formatText('123.4567891', '123', false, 3, 5, false, false, 16, true), '123.456');
         });
         it('integer = 0: 123.456 -> 0.456', function() {
            assert.equal(FormatText.formatText('123.4567891', '123', false, 3, 0, false, false, 16, true), '0.456');
         });
         it('integer = 3: 123456.789 -> 123.789', function() {
            assert.equal(FormatText.formatText('123456.789', '123', false, 3, 3, false, false, 16, true), '123.789');
         });
         it('delimiters = true: 1234567.89 -> 1 234 567.89', function() {
            assert.equal(FormatText.formatText('1234567.89', '123', false, 3, 9, true, false, 16, true), '1 234 567.89');
         });
         it('maxLength = 6: 12345.789 -> 12345.78', function() {
            assert.equal(FormatText.formatText('12345.789', '123', false, 9, 3, false, false, 6, true), '123.789');
         });
         it('maxLength = 19: 1234567891234567.78 -> 1234567891234567.78', function() {
            assert.equal(FormatText.formatText('1234567891234567.78', '1234567891234567.78', false, 3, 20, false, false, 19, true), '1234567891234567.78');
         });
         it('onlyPositive = true: -123.45 -> 123.45', function() {
            assert.equal(FormatText.formatText('123.45', '123', false, 4, 5, false, true, 16, true), '123.45');
         });
         it('hideEmptyDecimals = true: 123.45 -> 123.45', function() {
            assert.equal(FormatText.formatText('123.45', '123', false, 4, 5, false, false, 16, true), '123.45');
         });
         it('hideEmptyDecimals = true: 123 -> 123.0', function() {
            assert.equal(FormatText.formatText('123', '123', false, 4, 5, false, false, 16, true), '123.0');
         });
         it('hideEmptyDecimals = false: 123.45 -> 123.4500', function() {
            assert.equal(FormatText.formatText('123.45', '123', false, 4, 5, false, false, 16, false), '123.4500');
         });
         it('value = "": empty -> empty', function() {
            assert.equal(FormatText.formatText('123.45', '123', false, 4, 5, false, false, 16, false), '123.4500');
         });
         it('value = 123.0 type of number: 123 -> 123.0000', function() {
            assert.equal(FormatText.formatText(123.0, '123', false, 4, 5, false, false, 16, false), '123.0000');
         });
         it('0.0000001 -> 0.0000001', function() {
            assert.equal(FormatText.formatText(0.0000001, '0.0000001', false, -1, 5, false, false, 16, false), '0.0000001');
         });

      });
      afterEach(function() {
      });
   });
});