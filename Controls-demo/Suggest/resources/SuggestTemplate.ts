import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Suggest/resources/SuggestTemplate');

class SuggestTemplate extends Control{
   protected _template: TemplateFunction = controlTemplate;
}
export default SuggestTemplate;
