import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/FooterContentTemplate/Index');
import 'css!Controls-demo/Controls-demo';

class FooterContentTemplateDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default FooterContentTemplateDemo;
