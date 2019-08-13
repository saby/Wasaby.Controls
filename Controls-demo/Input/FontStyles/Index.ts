import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/FontStyles/FontStyles');
import 'css!Controls-demo/Controls-demo';

class FontStyles extends Control<IControlOptions> {
    private _linkValue = FontStyles._defaultValue;
    private _primaryValue = FontStyles._defaultValue;
    private _secondaryValue = FontStyles._defaultValue;
    private _successValue = FontStyles._defaultValue;
    private _warningValue = FontStyles._defaultValue;
    private _dangerValue = FontStyles._defaultValue;
    private _unaccentedValue = FontStyles._defaultValue;
    private _labelValue = FontStyles._defaultValue;
    private _defaultValue = FontStyles._defaultValue;
    private _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}
export default FontStyles;
