import * as Control from 'Core/Control';
import template = require('wml!Controls/Popup/Global/Openers');
import {Dialog as DialogOpener, Infobox as InfoboxOpener, Previewer as PreviewerOpener} from 'Controls/popup';

class Openers extends Control {

    // todo: https://online.sbis.ru/opendoc.html?guid=ca9e3c9e-88e4-4a1c-8b6f-709ece491da7

    private _children: {
        previewerOpener: PreviewerOpener,
        infoBoxOpener: InfoboxOpener,
        dialogOpener: DialogOpener
    };
 protected _template: Function = template;

    protected getPreviewer(): PreviewerOpener {
        return this._children.previewerOpener;
    };
    protected getInfoBox(): InfoboxOpener {
        return this._children.infoBoxOpener;
    };
    protected getDialog(): DialogOpener {
        return this._children.dialogOpener;
    };
}

export = Openers;