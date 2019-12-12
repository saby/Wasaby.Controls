import {Control, TemplateFunction} from 'UI/Base';
import {IPopupTemplateBaseOptions} from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/CloseButtonVisibility/Index');
import popupTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/CloseButtonVisibility/resources/PopupTemplate');
import 'css!Controls-demo/Controls-demo';

class CloseButtonVisibility extends Control<IPopupTemplateBaseOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _popupTemplate: TemplateFunction = popupTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default CloseButtonVisibility;
