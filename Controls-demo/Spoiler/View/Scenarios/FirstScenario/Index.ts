import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/Scenarios/FirstScenario/First');
import 'css!Controls-demo/Spoiler/View/Scenarios/FirstScenario/firstScenario';
import 'css!Controls-demo/Controls-demo';


class FirstScenario extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default FirstScenario;
