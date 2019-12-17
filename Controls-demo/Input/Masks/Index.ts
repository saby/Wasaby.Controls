import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Masks/Masks');
import 'css!Controls-demo/Controls-demo';

class Masks extends Control<IControlOptions> {
    protected _value1: string;
    protected _value2: string;
    protected _value3: string;
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}

export default Masks;
