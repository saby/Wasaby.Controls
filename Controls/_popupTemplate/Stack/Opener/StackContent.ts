import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import Template = require('wml!Controls/_popupTemplate/Stack/Opener/StackContent');
import * as tmplNotify from 'Controls/Utils/tmplNotify';

interface ISackContentOptions extends IControlOptions {
    stackMaxWidth?: number;
    stackMinWidth?: number;
    stackWidth?: number;
}

class StackContent extends Control<ISackContentOptions> {
    // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
    protected _template: TemplateFunction = Template;
    protected _tmplNotify: Function = tmplNotify;
    protected _minOffset: number;
    protected _maxOffset: number;
    protected _beforeMount(options: ISackContentOptions): void {
        this._updateOffset(options);
    }

    protected _beforeUpdate(options: ISackContentOptions): void {
        this._updateOffset(options);
    }

    private _updateOffset(options: ISackContentOptions): void {
        this._maxOffset = options.stackMaxWidth - options.stackWidth;
        this._minOffset = options.stackWidth - options.stackMinWidth;
    }

}
export default StackContent;
