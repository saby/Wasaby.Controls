/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.NumberTextBox'], function (NumberTextBox) {
    'use strict';
    var
        NTB,
        inputField,
        event;

    describe('SBIS3.CONTROLS.NumberTextBox', function () {
        beforeEach(function() {
           $('#mocha').append('<div id="component"></div>');
           NTB = new NumberTextBox({
               element: 'component',
               text: '1.234'
           });
           inputField = NTB._inputField;
           event = jQuery.Event("keydown");
           event.which = 8;
        });

        describe('Caret Position', function (){
            it('Delete last symbol in integer part', function (){
                NTB.setText(1.234);
                inputField.get(0).setSelectionRange(1,1);
                NTB.getContainer().trigger(event);
                assert.deepEqual(NTB._getCaretPosition(), [1,1]);
            });
        });

        afterEach(function () {
            NTB.destroy();
            NTB = undefined;
            inputField = undefined;
            event = undefined;
        });
    });
});