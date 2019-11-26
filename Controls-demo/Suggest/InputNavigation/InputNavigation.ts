import {Control, TemplateFunction} from 'UI/Base';
import * as Suggest from 'Controls-demo/Suggest/Suggest';
import controlTemplate = require('wml!Controls-demo/Suggest/InputNavigation/InputNavigation');

class InputNavigation extends Suggest{
   protected _template: TemplateFunction = controlTemplate;
}
export default InputNavigation;
