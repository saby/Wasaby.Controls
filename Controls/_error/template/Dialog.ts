/// <amd-module name="Controls/_error/Dialog" />
import Control from 'Controls/_error/types/Control';
// @ts-ignore
import * as tmpl from 'wml!Controls/_error/template/Dialog';

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
