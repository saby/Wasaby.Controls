import BaseViewModel from '../BaseViewModel';
import {IInputType, ISplitValue} from '../resources/Types';
import {textBySplitValue} from '../resources/Util';
import {IText} from 'Controls/decorator';

interface IViewModelOptions {
    maxLength?: number;
    constraint?: string;
}

class ViewModel extends BaseViewModel<string, IViewModelOptions> {
    protected _convertToDisplayValue(value: string | null): string {
        return value === null ? '' : value;
    }

    protected _convertToValue(displayValue: string): string {
        return displayValue;
    }

    protected _createText(splitValue: ISplitValue, inputType: IInputType): IText {
        if (inputType === 'insert') {
            if (this._options.constraint) {
                ViewModel._limitChars(splitValue, this._options.constraint);
            }
            if (this._options.maxLength) {
                ViewModel._limitLength(splitValue, this._options.maxLength);
            }
        }

        return  textBySplitValue(splitValue);
    }

    private static _limitChars(splitValue: ISplitValue, constraint: string): void {
        const constraintRegExp: RegExp = new RegExp(constraint, 'g');
        const match: RegExpMatchArray | null = splitValue.insert.match(constraintRegExp);

        splitValue.insert = match ? match.join('') : '';
    }

    private static _limitLength(splitValue: ISplitValue, maxLength: number): void {
        const maxInsertionLength: number = maxLength - splitValue.before.length - splitValue.after.length;
        splitValue.insert = splitValue.insert.substring(0, maxInsertionLength);
    }
}

export default ViewModel;
