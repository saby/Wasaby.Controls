import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Suggest_new/resources/EmptyTemplate');

class EmptyTemplate extends Control{
   protected _template: TemplateFunction = controlTemplate;
}
export default EmptyTemplate;
