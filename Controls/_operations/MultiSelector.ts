import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_operations/MultiSelector/MultiSelector');
import {IMultiSelectableOptions} from 'Controls/interface';

export interface IMultiSelectorOptions extends IMultiSelectableOptions, IControlOptions {
    isAllSelected: boolean;
    selectedKeysCount: number | null;
}

class MultiSelector extends Control<IMultiSelectorOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/operations'];
}

export default MultiSelector;
