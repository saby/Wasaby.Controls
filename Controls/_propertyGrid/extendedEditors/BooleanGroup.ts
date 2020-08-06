import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_propertyGrid/extendedEditors/BooleanGroup';
import {SyntheticEvent} from 'Vdom/Vdom';
import IEditor from 'Controls/_propertyGrid/IEditor';
import {RecordSet} from 'Types/collection';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';

export interface IPropertyGridButton {
    id: string;
    tooltip: string;
    icon: string;
    isLast?: boolean;
}

interface IOptions extends IEditorOptions, IControlOptions {
    buttons: IPropertyGridButton[];
}

export default class BooleanGroupEditor extends Control<IOptions> implements IEditor {
    protected _template: TemplateFunction = template;
    protected _buttons: RecordSet;
    protected _stateOfButtons: [boolean, boolean, boolean, boolean];

    protected _beforeMount({propertyValue, buttons}: IOptions): void {
        this._stateOfButtons = propertyValue;
        this._buttons = new RecordSet({
            keyProperty: 'id',
            rawData: buttons.map((option, index) => {
                // @ts-ignore
                option.active = propertyValue[index];
                if (index === buttons.length - 1) {
                    option.isLast = true;
                }
                return option;
            })
        });
    }

    protected _beforeUpdate({propertyValue}: IOptions): void {
        this._buttons.each((options, index) => {
            options.set('active', propertyValue[index]);
            this._stateOfButtons[index] = propertyValue[index];
        });
    }

    protected _valueChangedHandler(event: SyntheticEvent, id: string, newValue: boolean): void {
        this._stateOfButtons[id] = newValue;
        this._notify('propertyValueChanged', [this._stateOfButtons.slice()], {bubbling: true});
    }
}
