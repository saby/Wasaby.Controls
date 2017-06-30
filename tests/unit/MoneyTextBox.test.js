/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.MoneyTextBox'], function (NumberTextBox) {
    'use strict';
    var
        MTB,
        inputField;

    describe('SBIS3.CONTROLS.MoneyTextBox', function () {
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

        describe('Caret Position', function (){
           it('_inputFocusInHandler', function (){
              MTB.setText(1.234);
              MTB._setCaretPosition(3);
              MTB._inputFocusInHandler();
              assert.deepEqual(MTB._getCaretPosition(), [3,3]);
           });
        });
        afterEach(function () {
           MTB.destroy();
           MTB = undefined;
           inputField = undefined;
        });
    });
});