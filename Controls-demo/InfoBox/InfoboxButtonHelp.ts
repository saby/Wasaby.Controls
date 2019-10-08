import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/InfoBox/InfoboxButtonHelp');
import 'css!Controls-demo/InfoBox/resources/InfoboxButtonHelp';


class InfoboxButtonHelp extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default InfoboxButtonHelp;