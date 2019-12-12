import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/FooterContentTemplate/Index');
import popupTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/FooterContentTemplate/resources/PopupTemplateWithFooter');
import 'css!Controls-demo/Controls-demo';

class FooterContentTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _popupTemplate: TemplateFunction = popupTemplate;
    static _theme: string[] = ['Controls/Classes'];

    openSticky() {
        this._children.sticky.open({
            target: this._children.stickyButton,
            opener: this._children.stickyButton
        });
    }

    openStickyWithoutHead() {
        this._children.stickyWithoutHead.open({
            target: this._children.stickyButtonWithoutHead,
            opener: this._children.stickyButtonWithoutHead
        });
    }
}
export default FooterContentTemplate;
