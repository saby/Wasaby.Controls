import BaseViewModel = require('Controls/_input/Base/ViewModel');
import NumberViewModel = require('Controls/_input/Number/ViewModel');

import {parse} from 'Controls/_input/Number/parse';
import {format} from 'Controls/_input/Number/format';
import {decimalSplitter} from 'Controls/_input/Number/constant';
import {startingPosition} from "../Number/startingPosition";

class ViewModel extends BaseViewModel {
    protected _convertToValue(displayValue: string): string {
        return ViewModel.removeTrailingZeros(
            ViewModel.removeSpaces(displayValue)
        );
    }

    protected _convertToDisplayValue(value: string): string {
        const displayValue = super._convertToDisplayValue(value);

        return format(parse(displayValue), this._options, displayValue.length).value;
    }

    private static zeroFractionalPart: RegExp = new RegExp(`\\${decimalSplitter}?0*$`, 'g');

    private static removeSpaces(value: string): string {
        return value.replace(/\s/g, '');
    }

    private static removeTrailingZeros(value: string): string {
        return value.replace(ViewModel.zeroFractionalPart, '');
    }
}

ViewModel.prototype._getStartingPosition = NumberViewModel.prototype._getStartingPosition;
ViewModel.prototype.handleInput = NumberViewModel.prototype.handleInput;

export default ViewModel;
