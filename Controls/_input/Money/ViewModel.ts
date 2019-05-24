import BaseViewModel = require('Controls/_input/Base/ViewModel');
import NumberViewModel = require('Controls/_input/Number/ViewModel');

import {parse} from 'Controls/_input/Number/parse';
import {format} from 'Controls/_input/Number/format';
import {decimalSplitter} from 'Controls/_input/Number/constant';

class ViewModel extends BaseViewModel {
    constructor(options, value) {
        super(options, value);

        /**
         * Поменяли формат опции value у поля ввода денег. Чтобы не ломать прикладникам
         * сценарии(если есть) где они затачиваются на текущий формат перед выпуском, делаем новое поведение по опции.
         * В 400 правок уже не будет, сделано в одном реквесте.
         */
        if (!this._options._newValueBehavior) {
            this._convertToValue = BaseViewModel.prototype._convertToValue;
            this._convertToDisplayValue = BaseViewModel.prototype._convertToDisplayValue;
        }
    }

    protected _convertToValue(displayValue: string): string {
        return ViewModel.removeTrailingZeros(
            ViewModel.removeSpaces(displayValue)
        );
    }

    protected _convertToDisplayValue(value: string): string {
        const displayValue = super._convertToDisplayValue(value);

        return format(parse(displayValue), this._options, 0).value;
    }

    handleInput = NumberViewModel.prototype.handleInput;

    private static zeroFractionalPart: RegExp = new RegExp(`\\${decimalSplitter}?0*$`, 'g');

    private static removeSpaces(value: string): string {
        return value.replace(/\s/g, '');
    }

    private static removeTrailingZeros(value: string): string {
        return value.replace(ViewModel.zeroFractionalPart, '');
    }
}

export default ViewModel;
