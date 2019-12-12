import {Control, TemplateFunction} from 'UI/Base';
import {IPopupTemplateBaseOptions} from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/FooterContentTemplate/Index');
import 'css!Controls-demo/Controls-demo';]
import 'css!Controls-demo/PopupTemplate/Sticky/Sticky';

class FooterContentTemplate extends Control<IPopupTemplateBaseOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default FooterContentTemplate;
