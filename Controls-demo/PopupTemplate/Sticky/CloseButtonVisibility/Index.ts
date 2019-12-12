import {Control, TemplateFunction} from 'UI/Base';
import {IPopupTemplateBaseOptions} from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/CloseButtonVisibility/Index');
import popupTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/CloseButtonVisibility/resources/PopupTemplate');
import 'css!Controls-demo/Controls-demo';

class HeaderContentTemplate extends Control<IPopupTemplateBaseOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _popupTemplate: TemplateFunction = popupTemplate;
    static _theme: string[] = ['Controls/Classes'];

    openSticky(): void {
        this._children.sticky.open({
            target: this._children.stickyButton,
            opener: this._children.stickyButton,
            templateOptions: {
                closeButtonVisibility: true
            }
        });
    }

    openCloseSticky(): void {
        this._children.stickyClose.open({
            target: this._children.stickyCloseButton,
            opener: this._children.stickyCloseButton,
            templateOptions: {
                closeButtonVisibility: false
            }
        });
    }
}
export default HeaderContentTemplate;
