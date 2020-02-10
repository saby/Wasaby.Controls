import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import PopupTemplate = require('wml!Controls/_menu/Popup/popupTemplate');

class Popup extends Control<IControlOptions> {
    protected _template: TemplateFunction = PopupTemplate;

    protected _beforeMount(options: IControlOptions): void {
        if (options.showHeader) {
            this._headerTemplate = options.headerTemplate;
            this._headingCaption = options.headingCaption;
            this._headingIcon = options.headingIcon;
        }
    }

    protected _sendResult(event, action, data): void {
        this._notify('sendResult', [action, data], {bubbling: true});
    }

    protected  _afterMount(options?: IControlOptions): void {
        this._notify('sendResult', ['menuOpened', this._container], {bubbling: true});
    }

    protected _close(): void {
        this._notify('close', [], {bubbling: true});
    }

    static _theme: string[] = ['Controls/menu'];
}

export default Popup;
