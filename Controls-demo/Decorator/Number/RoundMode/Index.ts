import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Number/RoundMode/RoundMode');
import 'css!Controls-demo/Controls-demo';

class RoundMode extends Control<IControlOptions> {
    private _value = '12345.67890';
    private _fractionSize = 2;

    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default RoundMode;
