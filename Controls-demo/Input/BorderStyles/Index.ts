import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/BorderStyles/BorderStyles');
import 'css!Controls-demo/Controls-demo';

class BorderStyles extends Control<IControlOptions> {
    private _successValue = BorderStyles._defaultValue;
    private _secondaryValue = BorderStyles._defaultValue;
    private _warningValue = BorderStyles._defaultValue;
    private _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}

export default BorderStyles;
