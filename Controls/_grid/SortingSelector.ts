import template = require('wml!Controls/_grid/SortingResources/SortingSelector');
import {Control, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Record} from 'Types/entity';
import {Memory} from 'Types/source';
import {isEqual} from 'Types/object';
import {RecordSet} from 'Types/collection';
import {ISortingSelectorOptions, ISortingParam} from 'Controls/_interface/ISortingSelector';

type Order = 'ASC'|'DESC'|'';

class SortingSelector extends Control<ISortingSelectorOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: [number|string];
    private _currentParamName: string = null;
    private _orders: object = {};
    protected _source: Memory;
    // когда выбран пункт с иконкой, в вызывающем элементе отображается только иконка. У нее другой отступ.
    protected _nocaption: boolean = false;
    protected _saveLinkToItems: Function;
    protected _items: RecordSet;

    protected _beforeMount(options: ISortingSelectorOptions): void {
        this._saveLinkToItems = this._saveLinkToItemsFnc.bind(this);
        this.updateConfig(options.sortingParams, options.value);
    }

    protected  _beforeUpdate(newOptions: ISortingSelectorOptions): void {
        if (!isEqual(this._options.value, newOptions.value) ||
            !isEqual(this._options.sortingParams, newOptions.sortingParams)) {
            this.updateConfig(newOptions.sortingParams, newOptions.value);
        }
    }

    protected _saveLinkToItemsFnc(items: RecordSet): void {
        this._items = items;
    }

    // надо сбросить стрелку, которая показывает текущее выбранное значение. Остальные оставляем
    protected _resetSelectedArrow(): void {
        if (this._options.value && this._options.value.length) {
            const curArrowValue = this._options.value[0][this._currentParamName] || 'ASC';
            this._items?.getRecordById(this._currentParamName)?.set('value', curArrowValue);
            this._orders[this._currentParamName] = curArrowValue;
        }
    }

    private updateConfig(sortingParams: [ISortingParam], value: [object]|undefined): void {
        const data = [];

        if (value && value.length) {
            this._currentParamName = Object.keys(value[0])[0];
            this._orders[this._currentParamName] = value[0][this._currentParamName];
        } else {
            this._currentParamName = null;
        }
        sortingParams.forEach((item: ISortingParam) => {
            const dataElem = {...item, value: '', readOnly: false};
            const key = item.paramName;
            if (this._orders[key]) {
                dataElem.value = this._orders[key];
            }
            if (dataElem.paramName === this._currentParamName) {

                this._selectedKeys = [this._currentParamName];

                if (dataElem.icon) {
                    this._nocaption = true;
                }
            }
            data.push(dataElem);
        });

        this._source = new Memory({data, keyProperty: 'id'});
    }

    private _resetValue(): void {
        this._notify('valueChanged', [[]]);
    }

    protected _dropdownItemClick(e: SyntheticEvent<Event>, key: number|string): boolean | void {
        if (key === null) {
            this._resetValue();
        } else {
            const order = this._orders[key] || 'ASC';
            this._setValue(key, key ? order : '');
        }
        this._children.dropdown.closeMenu();
        return false;
    }
    private _setValue(param: string | number, order: string): void {
        const newValue = [];
        newValue[0] = {};
        newValue[0][param] = order;
        this._notify('valueChanged', [newValue]);
    }

    protected _switchValue(): void {
        const newValue: string = this._orders[this._currentParamName] === 'ASC' ? 'DESC' : 'ASC';
        this._setValue(this._currentParamName, newValue);
    }

    protected _arrowClick(e: SyntheticEvent<Event>, item: Record): void {
        e.stopPropagation();
        const value = item.get('value') || 'ASC';
        const key = item.get('paramName');
        const newValue = SortingSelector._getOppositeOrder(value);
        // для хранения текущих значений стрелок в выпадающем списке используем _orders
        // но список строится ТОЛЬКО по source и record полученным из него
        // для того чтобы перерисовать стрелку в списке пишем еще в и рекорд
        item.set('value', newValue);
        this._orders[key] = newValue;
    }

    static _theme: [string] = ['Controls/grid'];

    protected static _getOppositeOrder = (order: Order) => {
        if (order === 'DESC' || !order) {
            return 'ASC';
        }
        return 'DESC';
    }
}

export default SortingSelector;
