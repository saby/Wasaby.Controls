import {Control, TemplateFunction} from 'UI/Base';
import {IPopupTemplateBaseOptions} from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/BodyContentTemplate/Index');
import 'css!Controls-demo/Controls-demo';

class BodyContentTemplate extends Control<IPopupTemplateBaseOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default BodyContentTemplate;
