import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_propertyGrid/extendedEditors/BooleanGroup';
import {SyntheticEvent} from 'Vdom/Vdom';
import IEditor from 'Controls/_propertyGrid/IEditor';
import {RecordSet} from 'Types/collection';
import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import {IViewMode} from 'Controls/buttons';

export interface IPropertyGridButton {
    id: string;
    tooltip: string;
    icon: string;
    viewMode: IViewMode;
    isLast?: boolean;
}

interface IOptions extends IEditorOptions, IControlOptions {
    buttons: IPropertyGridButton[];
}

export default class BooleanGroupEditor extends Control<IOptions> implements IEditor {
    protected _template: TemplateFunction = template;
    protected _buttons: RecordSet;
    protected _stateOfStyles: [boolean, boolean, boolean, boolean];

    protected _beforeMount({propertyValue, buttons}: IOptions): void {
        this._stateOfStyles = propertyValue;
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
            this._stateOfStyles[index] = propertyValue[index];
        });
    }

    protected _valueChangedHandler(event: SyntheticEvent, id: string, newValue: boolean): void {
        this._stateOfStyles[id] = newValue;
        this._notify('propertyValueChanged', [this._stateOfStyles.slice()], {bubbling: true});
    }
}
