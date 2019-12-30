import template = require('wml!Controls/_grid/SortingResources/SortingSelector');
import 'css!theme?Controls/grid';
import {Control, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Record} from 'Types/entity';
import {Memory} from 'Types/source';
import {isEqual} from 'Types/object';
import {ISortingSelectorOptions} from 'Controls/interface/ISortingSelector';

class SortingSelector extends Control<ISortingSelectorOptions> {
    protected _template: TemplateFunction = template;
    private _selectedKeys: [number|string];
    private _currentParameterName: string = null;
    private _currentOrder: 'ASC'|'DESC' = null;
    private _source: Memory;

    protected _beforeMount(options: ISortingSelectorOptions): void {
        this.updateConfig(options.source, options.value, options.sortingParameterProperty, options.keyProperty);
    }

    protected  _beforeUpdate(newOptions: ISortingSelectorOptions): void {
        if (!isEqual(this._options.value, newOptions.value) ||
            !isEqual(this._options.source, newOptions.source)) {
            this.updateConfig(newOptions.source, newOptions.value, newOptions.sortingParameterProperty, newOptions.keyProperty);
        }
    }

    private updateConfig(source: Memory, value: [object]|undefined, sortingParameterProperty: string, keyProperty: string): void {
        const data = [...source.data];
        if (value && value.length) {
            this._currentParameterName = Object.keys(value[0])[0];
            this._currentOrder = value[0][this._currentParameterName];
        } else {
            this._currentParameterName = null;
            this._currentOrder = null;
        }
        data.forEach((item) => {
            item.value = '';
            if (item[sortingParameterProperty] === this._currentParameterName) {
                if (this._currentOrder !== null) {
                    item.value = this._currentOrder;
                }
                this._selectedKeys = [item[keyProperty]];
            }

            // Возможность клика должна быть только для пункта, который сбрасывает сортировку
            if (item[sortingParameterProperty] === null) {
                item.readOnly = false;
            } else {
                item.readOnly = true;
            }
        });
        this._source = new Memory({
            data,
            keyProperty
        });
    }

    private _resetValue(): void {
        this._notify('valueChanged', [[]]);
    }

    private _selectedKeysChangedHandler(e: SyntheticEvent<Event>, [key]: [number|string]): boolean | void {
        if (this._options.source.data.findIndex((item) => item.id === key && item.parameterName === null) >= 0) {
            this._resetValue();
            this._selectedKeys = [key];
        } else {
            return false;
        }
    }
    private _setValue(param: string, order: string): void {
        const newValue = [];
        newValue[0] = {};
        newValue[0][param] = order;
        this._notify('valueChanged', [newValue]);
    }
    private _switchValue(): void {
        const newValue: string = this._currentOrder === 'ASC' ? 'DESC' : 'ASC';
        this._setValue(this._currentParameterName, newValue);
    }
    private _itemArrowClick(e: SyntheticEvent<Event>, item: Record, order: 'ASC'|'DESC'): void {
        const param = item.get(this._options.sortingParameterProperty);
        this._selectedKeys = [item.get(this._options.keyProperty)];
        this._children.dropdown.closeMenu();
        this._setValue(param, order);
    }

    static _theme: [string] = ['Controls/grid'];
}

export default SortingSelector;
