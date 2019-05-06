/// <amd-module name="Controls/_dataSource/_error/DialogOpener" />
import Control = require('Core/Control');
import template = require('wml!Controls/_dataSource/_error/DialogOpener');

export default class DialogOpener extends Control {
    protected _template = template;
    private _openDialog(event, template, templateOptions) {
        let opener = this._children.dialogOpener;
        if (!opener) {
            return;
        }
        opener.open({
            template,
            templateOptions
        });
    }
}

