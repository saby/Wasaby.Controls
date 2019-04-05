import Control = require('Core/Control');
import template = require('wml!Controls/_propertyGrid/defaultEditors/Text');

import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import IEditor from 'Controls/_propertyGrid/IEditor';

/**
 * Editor for multiline string type.
 * @class Controls/_propertyGrid/defaultEditors/Text
 * @extends Core/Control
 * @interface Controls/_propertyGrid/IEditor
 * @control
 * @public
 * @author Герасимов А.М.
 */

// @ts-ignore
class TextEditor extends Control implements IEditor {
    protected _template: Function = template;
    protected _options: IEditorOptions;

    private value: string = '';
    private initialValue: string = '';

    _beforeMount(options: IEditorOptions): void {
        this.value = options.propertyValue;
        this.initialValue = options.propertyValue;
    }

    _inputCompleted(event: Event, value: string): void {
        if (this.initialValue !== value) {
            this._notify('propertyValueChanged', [value], {bubbling: true});
        }
    }
}

export = TextEditor;
