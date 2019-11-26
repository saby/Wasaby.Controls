import {Control, TemplateFunction} from 'UI/Base';
import * as Suggest from 'Controls-demo/Suggest/Suggest';
import controlTemplate = require('wml!Controls-demo/Suggest/InputMinLength/InputMinLength');

class InputMinLength extends Suggest{
   protected _template: TemplateFunction = controlTemplate;
}
export default InputMinLength;
