import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Suggest/resources/SuggestTabTemplate');

class SuggestTabTemplate extends Control{
   protected _template: TemplateFunction = controlTemplate;
}
export default SuggestTabTemplate;
