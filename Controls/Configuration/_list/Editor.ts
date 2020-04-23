import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/Configuration/_list/Editor/Editor';
import tmplNotify = require('Controls/Utils/tmplNotify');
import 'css!Controls/Configuration/_list/Editor/Editor';

interface IListEditorOptions extends IControlOptions {
    viewMode: string;
    previewTemplateName: string;
    previewTemplateOptions: Record<string, any>;
    editorValue: Record<string, string>;
}

export default class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _notifyHandler: Function = tmplNotify;
    protected _previewOptions: Record<string, any> = {};

    private _getPreviewOptions(
        editorValue: Record<string, any>,
        previewTemplateOptions: Record<string, any>
    ): Record<string, any> {
        return {
            ...previewTemplateOptions,
            ...editorValue
        };
    }

    protected _beforeMount(options: IListEditorOptions): void {
        this._previewOptions = this._getPreviewOptions(options.editorValue, options.previewTemplateOptions);
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        if (options.previewTemplateOptions !== this._options.previewTemplateOptions ||
            options.editorValue !== this._options.editorValue
        ) {
            this._previewOptions = this._getPreviewOptions(options.editorValue, options.previewTemplateOptions);
        }
    }
}
