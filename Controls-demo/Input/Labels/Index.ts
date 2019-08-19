import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Labels/Labels');
import 'css!Controls-demo/Controls-demo';

class Labels extends Control<IControlOptions> {
    private _value = Labels._defaultValue;
    private _requiredValue = Labels._defaultValue;
    private _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}
export default Labels;
