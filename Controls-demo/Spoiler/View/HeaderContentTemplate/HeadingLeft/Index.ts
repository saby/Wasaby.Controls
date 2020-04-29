import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/HeaderContentTemplate/HeadingLeft/HeadingLeft');
import 'css!Controls-demo/Controls-demo';

class SecondScenario extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _expanded: boolean = true;
    static _theme: string[] = ['Controls/Classes'];
}
export default SecondScenario;
