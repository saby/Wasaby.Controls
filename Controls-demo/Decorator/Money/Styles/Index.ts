import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/Styles/Styles');
import 'css!Controls-demo/Controls-demo';

class Styles extends Control<IControlOptions> {
    private _value = '123.45';
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default Styles;
