/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['SBIS3.CONTROLS/NumberTextBox'], function(NumberTextBox) {
   'use strict';
   var
      NTB,
      inputField,
      event,
      eventBlur;
   var componentElement;

   describe('SBIS3.CONTROLS/NumberTextBox', function() {
      beforeEach(function() {
         if (typeof $ === 'undefined') {
            this.skip();
         }
         componentElement = $('<div id="component"></div>');
         $('#mocha').append(componentElement);
         NTB = new NumberTextBox({
            element: 'component',
            text: '1.234',
            maxLength: 23
         });
         inputField = NTB._inputField;
         event = jQuery.Event('keydown');
         eventBlur = jQuery.Event('blur');
      });

      describe('Initializing options', function() {
         it('check numericValue', function() {
            assert.equal(NTB.getNumericValue(), 1.234);
         });
      });
      describe('Check format value', function() {
         it('check max integer length', function() {
            NTB.setIntegers(3);
            NTB.setText('12345.123');
            assert.equal(NTB._getInputValue(), '123.123');
            NTB.setText('-12345.123');
            assert.equal(NTB._getInputValue(), '-123.123');
            NTB.setText('<span lang="EN-US" style="font-size:72.0pt;line-height:\n\
                        115%;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;mso-ascii-theme-font:minor-latin;\n\
                        mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;mso-hansi-theme-font:\n\
                        minor-latin;mso-bidi-font-family:Aharoni;mso-ansi-language:EN-US;mso-fareast-language:\n\
                        EN-US;mso-bidi-language:AR-SA">10.</span><span lang="EN-US" style="font-size:\n\
                        11.0pt;line-height:115%;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;mso-ascii-theme-font:\n\
                        minor-latin;mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;\n\
                        mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Aharoni;mso-ansi-language:\n\
                        EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA">1</span>');
            assert.equal(NTB._getInputValue(), '10.1');
            NTB.setIntegers(16);
         });
         it('check max decimals length', function() {
            NTB.setDecimals(3);
            NTB.setText('123.123456');
            NTB.setDecimals(-1);
            assert.equal(NTB._getInputValue(), '123.123');
         });
         it('should hide empty decimals part on blur', function() {
            NTB.setText('123.100');
            NTB.setProperty('hideEmptyDecimals', true);
            inputField.trigger(eventBlur);
            assert.equal(NTB._getInputValue(), '123.1');
            NTB.setProperty('hideEmptyDecimals', false);
         });
         it('should divided into a triad', function() {
            NTB.setProperty('delimiters', true);
            NTB.setText('123456789.123');
            NTB.setProperty('delimiters', false);
            assert.equal(NTB._getInputValue(), '123 456 789.123');
         });
         it('should set only integer', function() {
            NTB.setProperty('onlyInteger', true);
            NTB.setText('123.123');
            NTB.setProperty('onlyInteger', false);
            assert.equal(NTB._getInputValue(), '123');
         });
         it('should set only positive', function() {
            NTB.setProperty('onlyPositive', true);
            NTB.setText('-123.12');
            NTB.setProperty('onlyPositive', false);
            assert.equal(NTB._getInputValue(), '123.12');
         });
         it('should not lose triads', function() {
            NTB.setProperty('integers', 16);
            NTB.setProperty('decimals', 0);
            NTB.setProperty('delimiters', true);
            NTB.setText('123 123 123 123 123');
            assert.equal(NTB._getInputValue(), '123 123 123 123 123');
         });
      });
      describe('Caret Position', function() {
         it('Delete last symbol in integer part', function() {
            NTB.setText(1.234);
            event.which = 8; // клавиша Delete
            inputField.get(0).setSelectionRange(1, 1);
            NTB.getContainer().trigger(event);
            assert.deepEqual(NTB._getCaretPosition(), [1, 1]);
         });
      });
      describe('Pressed "-"', function() {
         it('The value is equal null', function() {
            NTB.setText(null);
            event.which = 173; // клавиша "-"
            NTB._keyDownBind(event);

            assert.equal(NTB.getText(), '-0.0');
         });
      });
      describe('setDecimals', function() {
         it('14 -> 1', function() {
            assert.equal('1.234', NTB.getText());
            NTB.setDecimals(1);
            assert.equal('1.2', NTB.getText());
         });
      });
      afterEach(function() {
         NTB.destroy();
         NTB = undefined;
         inputField = undefined;
         event = undefined;
         componentElement && componentElement.remove();
      });
   });
});
