import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Search/Input/Base/Template');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/Search/Input/Base/Style';

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default ViewModes;
