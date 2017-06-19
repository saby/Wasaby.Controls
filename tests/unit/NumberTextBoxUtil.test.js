/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.Utils.NumberTextBoxUtil'], function (NumberTextBoxUtil) {

   'use strict';
   var
       newState = null;
   describe('SBIS3.CONTROLS.Utils.NumberTextBoxUtil', function () {

      describe('.numberPress', function (){
         it('1|3.12 => 12|3.12', function (){
            newState = NumberTextBoxUtil.numberPress(1, 1, '13.12', true, 16, 2, 50, 10); // press digit 2
            assert.equal(newState.value, '123.12');
            assert.equal(newState.caretPosition, 2);
         });
         it('0|.12 => 4|.12', function (){
            newState = NumberTextBoxUtil.numberPress(1, 1, '0.12', true, 16, 2, 52, 10); // press digit 4
            assert.equal(newState.value, '4.12');
            assert.equal(newState.caretPosition, 1);
         });
         it('0.12| => 0.123|', function (){
            newState = NumberTextBoxUtil.numberPress(4, 4, '0.12', true, 16, 3, 51, 10); // press digit 3
            assert.equal(newState.value, '0.123');
            assert.equal(newState.caretPosition, 5);
         });
         it('maxLengh: 1.23 => 1.23', function (){
            newState = NumberTextBoxUtil.numberPress(0, 0, '1.23', true, 16, 2, 51, 3); // press digit 3
            assert.equal(newState.value, '1.23');
            assert.equal(newState.caretPosition, 1);
         });
         it('maxInteger: 123.12 => 123.12', function (){
            newState = NumberTextBoxUtil.numberPress(1, 1, '123.12', true, 3, 2, 52, 10); // press digit 4
            assert.equal(newState.value, '123.12');
            assert.equal(newState.caretPosition, 1);
         });
         it('|12|3.12 => 43.12', function (){
            newState = NumberTextBoxUtil.numberPress(0, 2, '123.12', true, 16, 2, 52, 10); // press digit 4
            assert.equal(newState.value, '43.12');
            assert.equal(newState.caretPosition, 1);
         });
         it('0.|12| => 0.4|0', function (){
            newState = NumberTextBoxUtil.numberPress(2, 4, '0.12', true, 16, 2, 52, 10); // press digit 4
            assert.equal(newState.value, '0.40');
            assert.equal(newState.caretPosition, 3);
         });
         it('12.34 => 14|.04', function (){
            newState = NumberTextBoxUtil.numberPress(1, 4, '12.34', true, 16, 2, 52, 10); // press digit 4
            assert.equal(newState.value, '14.04');
            assert.equal(newState.caretPosition, 2);
         });
         it('-0.0 => -7|.0', function (){
            newState = NumberTextBoxUtil.numberPress(2, 2, '-0.0', true, 16, -1, 55, 10); // press digit 7
            assert.equal(newState.value, '-7.0');
            assert.equal(newState.caretPosition, 2);
         });

      });
      describe('.deletPressed', function (){
         it('1|23.12 => 1|3.12', function (){
            newState = NumberTextBoxUtil.deletPressed(1, 1, '123.12', true, 2);
            assert.equal(newState.value, '13.12');
            assert.equal(newState.caretPosition, 1);
         });
         it('|1 234.12 => |234.12', function (){
            newState = NumberTextBoxUtil.deletPressed(0, 0, '1 234.12', true, 2);
            assert.equal(newState.value, '234.12');
            assert.equal(newState.caretPosition, -1);
         });
         it('1.2|34 => 1.2|4', function (){
            newState = NumberTextBoxUtil.deletPressed(3, 3, '1.234', true, 3);
            assert.equal(newState.value, '1.24');
            assert.equal(newState.caretPosition, 3);
         });
         it('|1.234| => _', function (){
            newState = NumberTextBoxUtil.deletPressed(0, 5, '1.234', true, 3);
            assert.equal(newState.value, '');
            assert.equal(newState.caretPosition, 0);
         });
         it('1|.234 => 1.|234', function (){
            newState = NumberTextBoxUtil.deletPressed(1, 1, '1.234', true, 3);
            assert.equal(newState.value, '1.234');
            assert.equal(newState.caretPosition, 2);
         });
         it('1|23|.12 => 1|.12', function (){
            newState = NumberTextBoxUtil.deletPressed(1, 3, '123.12', true, 3);
            assert.equal(newState.value, '1.12');
            assert.equal(newState.caretPosition, 1);
         });
         it('0.1|23| => 0.1|', function (){
            newState = NumberTextBoxUtil.deletPressed(3, 5, '0.123', true, 3);
            assert.equal(newState.value, '0.1');
            assert.equal(newState.caretPosition, 3);
         });
         it('1|2.3|4 => 1|.4', function (){
            newState = NumberTextBoxUtil.deletPressed(1, 4, '12.34', true, 3);
            assert.equal(newState.value, '1.4');
            assert.equal(newState.caretPosition, 1);
         });
         it('|0.12 => .12', function (){
            newState = NumberTextBoxUtil.deletPressed(0, 0, '0.12', true, 3);
            assert.equal(newState.value, '.12');
            assert.equal(newState.caretPosition, 1);
         });

      });
      describe('.backspacePressed', function (){
         it('123|.12 => 12|.12', function (){
            newState = NumberTextBoxUtil.backspacePressed(3, 3, '123.12', true, 2);
            assert.equal(newState.value, '12.12');
            assert.equal(newState.caretPosition, 2);
         });
         it('1 |234.12 => |234.12', function (){
            newState = NumberTextBoxUtil.backspacePressed(1, 1, '1 234.12', true, 2);
            assert.equal(newState.value, '234.12');
            assert.equal(newState.caretPosition, -1);
         });
         it('1.23|4 => 1.2|4', function (){
            newState = NumberTextBoxUtil.backspacePressed(4, 4, '1.234', true, 3);
            assert.equal(newState.value, '1.24');
            assert.equal(newState.caretPosition, 3);
         });
         it('1.2|34 => 1|.34', function (){
            newState = NumberTextBoxUtil.backspacePressed(3, 3, '1.234', true, 3);
            assert.equal(newState.value, '1.34');
            assert.equal(newState.caretPosition, 1);
         });
         it('|1.234| => _', function (){
            newState = NumberTextBoxUtil.backspacePressed(0, 5, '1.234', true, 3);
            assert.equal(newState.value, '');
            assert.equal(newState.caretPosition, 0);
         });
         it('1|23|.12 => 1|.12', function (){
            newState = NumberTextBoxUtil.backspacePressed(1, 3, '123.12', true, 3);
            assert.equal(newState.value, '1.12');
            assert.equal(newState.caretPosition, 1);
         });
         it('1|2.3|4 => 1|.4', function (){
            newState = NumberTextBoxUtil.backspacePressed(1, 4, '12.34', true, 3);
            assert.equal(newState.value, '1.4');
            assert.equal(newState.caretPosition, 1);
         });
         it('12.3|45| => 12.3', function (){
            newState = NumberTextBoxUtil.backspacePressed(4, 6, '12.345', true, 3);
            assert.equal(newState.value, '12.3');
            assert.equal(newState.caretPosition, 4);
         });
         it('123|4 => 12|4', function (){
            newState = NumberTextBoxUtil.backspacePressed(3, 3, '1234', false, 3);
            assert.equal(newState.value, '124');
            assert.equal(newState.caretPosition, 2);
         });
      });
   });
});