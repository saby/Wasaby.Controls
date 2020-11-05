import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/process/Diagram/Base/Template');

class Diagram extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Diagram;
