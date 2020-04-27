import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/InfoBox/InfoboxButtonHelp');
import 'css!Controls-demo/InfoBox/resources/InfoboxButtonHelp';
import 'css!Controls-demo/Controls-demo';


class InfoboxButtonHelp extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default InfoboxButtonHelp;