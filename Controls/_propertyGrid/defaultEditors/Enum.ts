import Control = require('Core/Control');
import template = require('wml!Controls/_propertyGrid/defaultEditors/Enum');

import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import IEditor from 'Controls/_propertyGrid/IEditor';
import {IPropertyGridButton} from 'Controls/_propertyGrid/extendedEditors/BooleanGroup';
import {RecordSet} from 'Types/collection';

/**
 * Редактор для перечисляемого типа данных.
 * 
 * @remark
 * Полезные ссылки:
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_propertyGrid.less">переменные тем оформления</a>
 * 
 * @class Controls/_propertyGrid/defaultEditors/Enum
 * @extends Core/Control
 * @mixes Controls/_propertyGrid/IEditor
 * @control
 * @public
 * @author Герасимов А.М.
 */

/*
 * Editor for enum type.
 * @class Controls/_propertyGrid/defaultEditors/Enum
 * @extends Core/Control
 * @mixes Controls/_propertyGrid/IEditor
 * @control
 * @public
 * @author Герасимов А.М.
 */

type TEnumEditorViewMode = 'buttons' | 'dropdown';

interface IOptions extends IEditorOptions {
    viewMode: TEnumEditorViewMode;
    buttons: IPropertyGridButton[];
}

// @ts-ignore
class EnumEditor extends Control implements IEditor {
    protected _template: Function = template;
    protected _options: IOptions;

    protected _buttons: RecordSet;
    protected _optionsCount: number;
    protected selectedKey: string = '';

    _beforeMount(options: IOptions): void {
        if (options.viewMode === 'buttons' && options.buttons) {
            // @ts-ignore
            options.buttons[options.buttons.length - 1].isLast = true;
            this._buttons = new RecordSet({
                keyProperty: 'id',
                rawData: options.buttons
            });
        }
        this._enum = options.propertyValue;
        this.selectedKey = options.propertyValue.getAsValue();
    }

    _beforeUpdate(options: IOptions): void {
        this._enum = options.propertyValue;
        this.selectedKey = options.propertyValue.getAsValue();
    }

    _selectedKeyChanged(event: Event, value: string): void {
        this.selectedKey = value;
        this._enum.setByValue(value);
        this._notify('propertyValueChanged', [this._enum], {bubbling: true});
    }

    static getDefaultOptions(): Partial<IOptions> {
        return {
            viewMode: 'dropdown'
        };
    }
}

export = EnumEditor;
