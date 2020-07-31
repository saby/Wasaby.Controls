import {ISelection, ISplitValue} from './Types';
import {IText} from 'Controls/decorator';

export function textBySplitValue(splitValue: ISplitValue): IText {
    return {
        carriagePosition: splitValue.before.length + splitValue.insert.length,
        value: splitValue.before + splitValue.insert + splitValue.after
    };
}

export function hasSelectionChanged(selection: ISelection, carriagePosition: number): boolean {
    return selection.start !== selection.end ||
        selection.end !== carriagePosition;
}
