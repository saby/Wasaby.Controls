import {TemplateFunction} from 'UI/Base';
import * as Suggest from 'Controls-demo/Suggest/Suggest';
import controlTemplate = require('wml!Controls-demo/Suggest/SelectorEmpty/SelectorEmpty');

class SelectorEmpty extends Suggest{
   protected _template: TemplateFunction = controlTemplate;
}
export default SelectorEmpty;
