import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_popup/Previewer/PreviewerTemplate');
import Utils = require('View/Executor/Utils');
import 'Controls/Container/Async';
import {load} from 'Core/library';

/**
 * @class Controls/_popup/Previewer/PreviewerTemplate
 * @private
 */

interface IPreviewerOptions extends IControlOptions {
    template: string|TemplateFunction;
}

class PreviewerTemplate extends Control<IPreviewerOptions> {
    _template: TemplateFunction = template;

    protected _beforeMount(options: IPreviewerOptions): void|Promise<TemplateFunction> {
        if (typeof window !== 'undefined' && this._needRequireModule(options.template)) {
            return load(options.template);
        }
    }

    private _needRequireModule(module: string|TemplateFunction): boolean {
        return typeof module === 'string' && !Utils.RequireHelper.defined(module);
    }

    private _sendResult(event: Event): void {
        this._notify('sendResult', [event], {bubbling: true});
    }
}

export = PreviewerTemplate;

