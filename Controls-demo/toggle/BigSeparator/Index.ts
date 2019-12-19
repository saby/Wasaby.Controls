import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/BigSeparator/Index');
import 'css!Controls-demo/Controls-demo';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default Index;
