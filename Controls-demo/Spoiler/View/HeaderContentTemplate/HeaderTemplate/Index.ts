import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/HeaderContentTemplate/HeaderTemplate/HeaderTemplate');
import 'css!Controls-demo/Spoiler/View/HeaderContentTemplate/HeaderTemplate/headerTemplate';
import 'css!Controls-demo/Controls-demo';


class FirstScenario extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default FirstScenario;
