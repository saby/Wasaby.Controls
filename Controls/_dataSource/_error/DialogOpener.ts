/// <amd-module name="Controls/_dataSource/_error/DialogOpener" />
import Control = require('Core/Control');
import template = require('wml!Controls/_dataSource/_error/DialogOpener');

export default class DialogOpener extends Control {
    protected _template = template;
    private __onclose: (() => void) | void;

    /**
     *
     * @param template
     * @param templateOptions
     * @param onclose
     */
    showDialog(template, templateOptions, onclose) {
        let opener = this._children.dialogOpener;
        if (this.__onclose) {
            this.__onclose();
        }
        this.__onclose = onclose;
        opener.open({
            template,
            templateOptions
        });
    }

    private _onServiceError(event, template, templateOptions, onclose) {
        this.showDialog(template, templateOptions, onclose);
    }
    private _onClose(event) {
        if (this.__onclose) {
            this.__onclose();
            delete this.__onclose;
        }
    }
}

