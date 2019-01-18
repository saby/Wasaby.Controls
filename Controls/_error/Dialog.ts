/// <amd-module name="Controls/_error/Dialog" />
// @ts-ignore
import * as Control from 'Core/Control';
// @ts-ignore
import * as tmpl from 'wml!Controls/_error/Dialog';

export default class Dialog extends Control {
    protected _template = tmpl;
    /**
     * Close the dialog
     * @function Controls/Popup/Templates/Dialog/ConfirmationTemplate#close
     */
    close() {
        // @ts-ignore
        this._notify('close', [], { bubbling: true });
    }
}
