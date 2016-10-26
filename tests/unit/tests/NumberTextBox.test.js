/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.NumberTextBox'], function (NumberTextBox) {

    'use strict';
    describe('SBIS3.CONTROLS.NumberTextBox', function () {
        let NTB = new NumberTextBox({
            element: 'component',
            text: '1.234'
        });

        describe('Caret Position', function (){
            it('Delete last symbol in integer part', function (){
                let inputField = NTB._inputField,
                    event = jQuery.Event("keydown");

                event.which = 8;
                NTB.setText(1.234);
                inputField.get(0).setSelectionRange(1,1);
                NTB.getContainer().trigger(event);
                assert.deepEqual(NTB._getCaretPosition(), [1,1]);

                after(function () {
                    inputField = undefined;
                    event = undefined;
                });
            });

        });

        after(function () {
            NTB.destroy();
            NTB = undefined;
        });
    });

});