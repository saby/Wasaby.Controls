import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_toggle/RadioButtons/RadioButtons');
import {descriptor as EntityDescriptor} from 'Types/entity';

class RadioButtons extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static _theme: string[] = ['Controls/buttons', 'Controls/toggle', 'Controls/Classes'];

    static getDefaultOptions(): object {
        return {
            value: false
        };
    }
    static getOptionTypes(): object {
        return {
            value: EntityDescriptor(Boolean)
        };
    }
}

export default RadioButtons;
