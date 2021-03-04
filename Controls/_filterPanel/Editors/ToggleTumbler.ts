import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import ToggleTumblerTemplate = require('wml!Controls/_filterPanel/Editors/ToggleTumbler');
import {RecordSet} from 'Types/collection';
import {SyntheticEvent} from 'Vdom/Vdom';

interface IToggleTumblerOptions extends IControlOptions {
    propertyValue: string|number;
    items: RecordSet;
}

interface IToggleTumbler {
    readonly '[Controls/_filterPanel/Editors/ToggleTumbler]': boolean;
}

/**
 * Контрол используют в качестве редактора кнопочного переключателя.
 * @class Controls/_filterPanel/Editors/ToggleTumbler
 * @extends UI/Base:Control
 * @mixes Controls/_toggle/Tumbler
 * @author Мельникова Е.А.
 * @public
 */

class ToggleTumbler extends Control<IToggleTumblerOptions> implements IToggleTumbler {
    readonly '[Controls/_filterPanel/Editors/ToggleTumbler]': boolean = true;
    protected _template: TemplateFunction = ToggleTumblerTemplate;
    protected _selectedKey: string|number = null;

    protected _beforeMount(options: IToggleTumblerOptions): void {
        this._selectedKey = options.propertyValue;
    }

    protected _beforeUpdate(options: IToggleTumblerOptions): void {
        if (this._options.propertyValue !== options.propertyValue) {
            this._selectedKey = options.propertyValue;
        }
    }

    protected _selectedKeyChangedHandler(event: SyntheticEvent, value: string|number): void {
        const extendedValue = {
            value,
            textValue: this._getTextValue(value)
        };
        this._notify('propertyValueChanged', [extendedValue], {bubbling: true});
    }

    private _getTextValue(id: string|number): string {
        const record = this._options.items.getRecordById(id);
        return record.get('caption');
    }
}
export default ToggleTumbler;
