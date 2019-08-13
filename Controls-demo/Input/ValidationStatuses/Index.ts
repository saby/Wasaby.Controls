import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/ValidationStatuses/ValidationStatuses');
import 'css!Controls-demo/Controls-demo';

class ValidationStatuses extends Control<IControlOptions> {
    private _validValue = ValidationStatuses._defaultValue;
    private _invalidValue = ValidationStatuses._defaultValue;
    private _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}

export default ValidationStatuses;
