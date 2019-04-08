import Control = require('Core/Control');
import template = require('wml!Controls/_propertyGrid/defaultEditors/Boolean');

import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import IEditor from 'Controls/_propertyGrid/IEditor';
import 'Controls/Toggle/Checkbox';

// @ts-ignore
class BooleanEditor extends Control implements IEditor {
    protected _template: Function = template;
    protected _options: IEditorOptions;

    private value: boolean;

    _beforeMount(options: IEditorOptions): void {
        this.value = options.propertyValue;
    }

    _valueChanged(event: Event, value: boolean): void {
        this.value = value;
        this._notify('propertyValueChanged', [value], {bubbling: true});
    }
}

export = BooleanEditor;
