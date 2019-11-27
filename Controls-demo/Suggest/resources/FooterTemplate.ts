import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Suggest/resources/FooterTemplate');

class FooterTemplate extends Control{
   protected _template: TemplateFunction = controlTemplate;
}
export default FooterTemplate;
