import {TemplateFunction} from 'UI/Base';
import * as Suggest from 'Controls-demo/Suggest/Suggest';
import controlTemplate = require('wml!Controls-demo/Suggest/SelectorFooter/SelectorFooter');

class SelectorFooter extends Suggest{
   protected _template: TemplateFunction = controlTemplate;
}
export default SelectorFooter;
