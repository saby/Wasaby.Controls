import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {RequireHelper} from 'View/Executor/Utils';
import template = require('wml!Controls/_popup/Previewer/PreviewerTemplate');
import 'Controls/Container/Async';
import {load} from 'Core/library';

/**
 * @class Controls/_popup/Previewer/PreviewerTemplate
 * @private
 */

interface IPreviewerOptions extends IControlOptions {
    template: string|TemplateFunction;
    templateOptions: any;
}

class PreviewerTemplate extends Control<IPreviewerOptions> {
    _template: TemplateFunction = template;

    protected _beforeMount(options: IPreviewerOptions): void|Promise<void> {
        if (typeof window !== 'undefined' && this._needRequireModule(options.template)) {
            return load(options.template as string);
        }
    }

    private _needRequireModule(module: string|TemplateFunction): boolean {
        return typeof module === 'string' && !RequireHelper.defined(module);
    }

    protected _sendResult(event: Event): void {
        this._notify('sendResult', [event], {bubbling: true});
    }
}

export default PreviewerTemplate;
