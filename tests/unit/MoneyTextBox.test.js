/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['SBIS3.CONTROLS/MoneyTextBox'], function (NumberTextBox) {
    'use strict';
    var
        MTB,
        inputField,
        formattedValue;

    describe('SBIS3.CONTROLS/MoneyTextBox', function () {
        beforeEach(function() {
           if (typeof $ === 'undefined') {
              this.skip();
           }
           $('#mocha').append('<div id="component"></div>');
           MTB = new NumberTextBox({
              element: 'component',
              text: '1234.56',
              maxLength: 23
           });
           inputField = MTB._inputField;
        });

       describe('Check format value', function() {
          it('check html value', function() {
             MTB.setText('<span lang="EN-US" style="font-size:72.0pt;line-height:\n\
                        115%;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;mso-ascii-theme-font:minor-latin;\n\
                        mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;mso-hansi-theme-font:\n\
                        minor-latin;mso-bidi-font-family:Aharoni;mso-ansi-language:EN-US;mso-fareast-language:\n\
                        EN-US;mso-bidi-language:AR-SA">10.</span><span lang="EN-US" style="font-size:\n\
                        11.0pt;line-height:115%;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;mso-ascii-theme-font:\n\
                        minor-latin;mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;\n\
                        mso-hansi-theme-font:minor-latin;mso-bidi-font-family:Aharoni;mso-ansi-language:\n\
                        EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA">1</span>');
             assert.equal(MTB._getInputValue(), '10.10');
          });

          it('check value outside', function() {
             MTB.setProperty('text', '1234.56');
             formattedValue = MTB._formatText('9999999999999999.99');
             assert.equal(formattedValue, '99 999 999 999 999.99');
          });

          it('should set only positive', function() {
             MTB.setProperty('onlyPositive', true);
             MTB.setText('-123.12');
             MTB.setProperty('onlyPositive', false);
             assert.equal(MTB._getInputValue(), '123.12');
          })
       });

        describe('Caret Position', function (){
           it('_inputFocusInHandler', function (){
              MTB.setText(1.234);
              MTB._setCaretPosition(3);
              MTB._inputFocusInHandler();
              assert.deepEqual(MTB._getCaretPosition(), [1,1]);
           });
        });
       describe('setDecimals', function() {
          it('2 -> 1', function() {
             assert.equal('1 234.56', MTB.getText());
             MTB.setDecimals(1);
             assert.equal('1 234.5', MTB.getText());
          });
       });
        afterEach(function () {
           MTB.destroy();
           MTB = undefined;
           inputField = undefined;
        });
    });
});