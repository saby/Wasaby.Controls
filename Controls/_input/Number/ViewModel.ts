import BaseViewModel = require('Controls/_input/Base/ViewModel');
import splitIntoTriads = require('Controls/Utils/splitIntoTriads');

import {format} from 'Controls/_input/Number/format';
import {IText, paste} from 'Controls/_input/Base/Util';
import {IParsedNumber, parse} from 'Controls/_input/Number/parse';
import {decimalSplitter, decimalSplitters} from 'Controls/_input/Number/constant';

/**
 * @class Controls/_input/Number/ViewModel
 * @private
 * @author Журавлев М.С.
 */

const _private = {
    valueWithoutTrailingZerosRegExp: /-?[0-9 ]*(([1-9]|([0.])(?!0*$))*)?/,

    valueWithOneTrailingZerosRegExp: /-?[0-9 ]*(\.[0-9]([1-9]|0(?!0*$))*)?/,

    integerPartRegExp: /^-?[0-9 ]+$/,

    onlyIntegerPart: function (value) {
        return _private.integerPartRegExp.test(value);
    },

    isDecimalPartEqualZero: function (value) {
        return !!value && value.indexOf('.0') === value.length - 2;
    },

    joinGroups: function (value) {
        return value.replace(/ /g, '');
    },

    prepareData: function ({value, carriagePosition}: IText) {
        const position = carriagePosition;
        const before = value.substring(0, position);
        const after = value.substring(position, value.length);

        return {
            before, after,
            insert: '',
            delete: ''
        };
    },

    superHandleInput: function (self, result: IText, inputType: string) {
        return ViewModel.superclass.handleInput.call(self, _private.prepareData(result), inputType);
    },

    handleRemovalSplitterTriad: function (splitValue, inputType) {
        if (splitValue.delete === ' ') {
            if (inputType === 'deleteBackward') {
                splitValue.before = splitValue.before.slice(0, -1);
            }
            if (inputType === 'deleteForward') {
                splitValue.after = splitValue.after.substring(1);
            }
        }
    },

    recoverText: function (splitValue): IText {
        let value: string = splitValue.before;
        const carriagePosition: number = _private.joinGroups(value).length;

        value += splitValue.after;

        value = _private.joinGroups(value);

        if (value && splitValue.delete.includes(decimalSplitter)) {
            value = paste(value, decimalSplitter, carriagePosition);
        }

        return {value, carriagePosition};
    },

    pasteInIntegerPart: function ({value, carriagePosition}: IText, parsedNumber: IParsedNumber, splitterPosition: number) {
        value = paste(value, parsedNumber.integer, carriagePosition);

        if (parsedNumber.fractional) {
            if (splitterPosition === -1) {
                splitterPosition = value.length;
                value += decimalSplitter;
            } else {
                splitterPosition += parsedNumber.integer.length;
            }

            value = paste(value, parsedNumber.fractional, splitterPosition + 1);
            carriagePosition = splitterPosition + parsedNumber.fractional.length + 1;
        } else {
            carriagePosition += parsedNumber.integer.length;
        }

        return {value, carriagePosition};
    },

    pasteInFractionalPart: function ({value, carriagePosition}: IText, parsedNumber: IParsedNumber) {
        const pastedValue: string = parsedNumber.integer + parsedNumber.fractional;

        value = paste(value, pastedValue, carriagePosition);
        carriagePosition += pastedValue.length;

        return {value, carriagePosition};
    }
};

var ViewModel = BaseViewModel.extend({

    /**
     * @param {String} displayValue
     * @return {Number}
     * @protected
     */
    _convertToValue: function (displayValue) {
        /**
         * The displayed value can be separated by spaces into triads.
         * You need to remove these gaps to parseFloat processed value completely.
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
         */
        var value = parseFloat(_private.joinGroups(displayValue));

        return Number.isNaN(value) ? null : value;
    },

    /**
     * @param {Number} value
     * @return {String}
     * @protected
     */
    _convertToDisplayValue: function (value) {
        var displayValue = value === null ? '' : value.toString();

        if (this._options.useGrouping) {
            displayValue = splitIntoTriads(displayValue);
        }

        return displayValue;
    },

    handleInput: function (splitValue, inputType) {
        let parsedNumber: IParsedNumber;

        _private.handleRemovalSplitterTriad(splitValue, inputType);

        let text: IText = _private.recoverText(splitValue);

        if (inputType !== 'insert' && text.value === '') {
            return _private.superHandleInput(this, text, inputType);
        }

        /**
         * To enter the fractional part, you can go directly by pressing a dot or a comma.
         */
        if (decimalSplitters.includes(splitValue.insert) && splitValue.delete === '') {
            const splitterPosition: number = text.value.indexOf(decimalSplitter);

            if (splitterPosition !== -1) {
                text.carriagePosition = splitterPosition + 1;
            }

            return _private.superHandleInput(this, text, inputType);
        }

        if (inputType === 'insert') {
            parsedNumber = parse(splitValue.insert);

            /**
             * If entered a negative number, then change the current one to the opposite.
             */
            if (parsedNumber.negative && text.value[0] !== '-') {
                text.carriagePosition++;
                text.value = paste(text.value, '-', 0);
            }

            const splitterPosition: number = text.value.indexOf(decimalSplitter);

            if (splitterPosition === -1) {
                text = _private.pasteInIntegerPart(text, parsedNumber, splitterPosition);
            } else {
                text = splitterPosition < text.carriagePosition ?
                    _private.pasteInFractionalPart(text, parsedNumber) :
                    _private.pasteInIntegerPart(text, parsedNumber, splitterPosition);
            }
        }

        if (text.value === '') {
            return _private.superHandleInput(this, text, inputType);
        }

        parsedNumber = parse(text.value);

        return _private.superHandleInput(this, format(parsedNumber, this._options, text.carriagePosition), inputType);
    },

    trimTrailingZeros: function (leaveOneZero) {
        if (this._options.showEmptyDecimals) {
            return false;
        }

        var regExp = leaveOneZero
            ? _private.valueWithOneTrailingZerosRegExp
            : _private.valueWithoutTrailingZerosRegExp;
        var trimmedValue = this._displayValue.match(regExp)[0];

            if (this._displayValue !== trimmedValue) {
               var oldValue = this._displayValue;
               this._displayValue = trimmedValue;

               // если ничего не поменялось - не надо изменять версию
               if (oldValue !== trimmedValue) {
                  this._nextVersion();
               }

               this._shouldBeChanged = true;

            return true;
        }

        return false;
    },

         addTrailingZero: function() {
            if (this._options.precision !== 0 && _private.onlyIntegerPart(this._displayValue)) {
               this._displayValue += '.0';
               this._nextVersion();
               this._shouldBeChanged = true;

            return true;
        }

        return false;
    }
});

export = ViewModel;
   
