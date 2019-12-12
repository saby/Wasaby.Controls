import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/HeaderContentTemplate/Index');
import popupTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/HeaderContentTemplate/resources/PopupTemplate');
import popupTemplateWithoutHead = require('wml!Controls-demo/PopupTemplate/Sticky/HeaderContentTemplate/resources/PopupTemplateWithoutHead');
import 'css!Controls-demo/Controls-demo';

class HeaderContentTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _popupTemplate: TemplateFunction = popupTemplate;
    private _popupTemplateWithoutHead: TemplateFunction = popupTemplateWithoutHead;
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

    openStickyWithoutHead(): void {
        this._children.stickyWithoutHead.open({
            target: this._children.stickyButtonWithoutHead,
            opener: this._children.stickyButtonWithoutHead,
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
    openCloseStickyWithoutHead(): void {
        this._children.stickyCloseWithoutHead.open({
            target: this._children.stickyCloseButtonWithoutHead,
            opener: this._children.stickyCloseButtonWithoutHead,
            templateOptions: {
                closeButtonVisibility: false
            }
        });
    }
}
export default HeaderContentTemplate;
