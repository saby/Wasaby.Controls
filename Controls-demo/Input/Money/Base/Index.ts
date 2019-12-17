import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Money/Base/Index');
import 'css!Controls-demo/Controls-demo';

class Index extends Control<IControlOptions> {
    protected _value1: string = null;
    protected _value2: string = null;
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default Index;
