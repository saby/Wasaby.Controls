import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Stack/HeaderBorderVisible/HeaderBorderVisible');
import 'css!Controls-demo/Controls-demo';

class HeaderBorderVisible extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default HeaderBorderVisible;
