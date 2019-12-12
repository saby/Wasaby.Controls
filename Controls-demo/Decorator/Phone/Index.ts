import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Phone/Phone');
import 'css!Controls-demo/Controls-demo';

class Phone extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default Phone;
