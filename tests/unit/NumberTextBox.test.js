/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.NumberTextBox'], function (NumberTextBox) {
    'use strict';
    var
        NTB,
        inputField,
        event,
        eventBlur;

    describe('SBIS3.CONTROLS.NumberTextBox', function () {
        beforeEach(function() {
            $('#mocha').append('<div id="component"></div>');
            NTB = new NumberTextBox({
                element: 'component',
                text: '1.234',
                maxLength: 23
            });
            inputField = NTB._inputField;
            event = jQuery.Event("keydown");
            eventBlur = jQuery.Event("blur");
        });
        describe('Check format value', function (){
            it('check max integer length', function (){
                NTB.setIntegers(3);
                NTB.setText('12345.123');
                assert.equal(NTB._getInputValue(), '123.123');
                NTB.setText('-12345.123');
                assert.equal(NTB._getInputValue(), '-123.123');
                NTB.setIntegers(16);
            });
            it('check max decimals length', function (){
                NTB.setDecimals(3);
                NTB.setText('123.123456');
                NTB.setDecimals(-1);
                assert.equal(NTB._getInputValue(), '123.123');
            });
            it('should hide empty decimals part on blur', function (){
                NTB.setText('123.100');
                NTB.setProperty('hideEmptyDecimals', true);
                inputField.trigger(eventBlur);
                assert.equal(NTB._getInputValue(), '123.1');
                NTB.setProperty('hideEmptyDecimals', false);
            });
            it('should divided into a triad', function (){
                NTB.setProperty('delimiters', true);
                NTB.setText('123456789.123');
                NTB.setProperty('delimiters', false);
                assert.equal(NTB._getInputValue(), '123 456 789.123');
            });
            it('should set only integer', function (){
                NTB.setProperty('onlyInteger', true);
                NTB.setText('123.123');
                NTB.setProperty('onlyInteger', false);
                assert.equal(NTB._getInputValue(), '123');
            });
            it('should set only positive', function (){
                NTB.setProperty('onlyPositive', true);
                NTB.setText('-123.12');
                NTB.setProperty('onlyPositive', false);
                assert.equal(NTB._getInputValue(), '123.12');
            });
        });
        describe('Caret Position', function (){
            it('Delete last symbol in integer part', function (){
                NTB.setText(1.234);
                event.which = 8; // клавиша Delete
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