import {TemplateFunction} from 'UI/Base';
import * as Suggest from 'Controls-demo/Suggest/Suggest';
import controlTemplate = require('wml!Controls-demo/Suggest/SelectorDisplayProperty/SelectorDisplayProperty');

class SelectorDisplayProperty extends Suggest{
   protected _template: TemplateFunction = controlTemplate;
}
export default SelectorDisplayProperty;
