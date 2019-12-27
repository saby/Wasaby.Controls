import template = require('wml!Controls/_grid/SortResources/SortButton');
import 'css!theme?Controls/grid';
import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {ICrud, Memory} from 'Types/source';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Record} from 'Types/entity';
import {isEqual} from 'Types/object';
import {ISortButtonOptions, ISortingParameter} from 'Controls/interface/ISortButton';

class SortButton extends Control<ISortButtonOptions> {
    protected _template: TemplateFunction = template;
    private _selectedKeys: [number|string];
    private _source: ICrud = null;
    private _currentParameterName: string = null;
    private _currentValue: 'ASC'|'DESC' = null;

    protected _beforeMount(options: ISortButtonOptions): void {
        this.updateConfig(options.sortingParameters, options.sorting);
    }

    protected  _beforeUpdate(newOptions: ISortButtonOptions): void {
        if (!isEqual(this._options.sorting, newOptions.sorting) ||
            !isEqual(this._options.sortingParameters, newOptions.sortingParameters)) {
            this.updateConfig(newOptions.sortingParameters, newOptions.sorting);
        }
    }

    private updateConfig(sortingParameters: [ISortingParameter], sorting: [object]|undefined): void {
        const data = [];

        if (sorting && sorting.length) {
            this._currentParameterName = Object.keys(sorting[0])[0];
            this._currentValue = sorting[0][this._currentParameterName];
        } else {
            this._currentParameterName = null;
            this._currentValue = null;
        }
        sortingParameters.forEach((item: ISortingParameter, i: number) => {
            const dataElem = {...item, id: i, value: '', readOnly: true};
            if (dataElem.parameterName === this._currentParameterName) {
                if (this._currentValue !== null) {
                    dataElem.value = this._currentValue;
                }
                this._selectedKeys = [i];
            }

            // Возможность клика должна быть только для пункта, который сбрасывает сортировку
            if (item.parameterName === null) {
                dataElem.readOnly = false;
            }
            data.push(dataElem);
        });

        this._source = new Memory({data, keyProperty: 'id'});
    }

    private _resetSorting(): void {
        this._notify('sortingChanged', [[]]);
    }

    private _selectedKeysChangedHandler(e: SyntheticEvent<Event>, [key]: [number|string]): boolean | void {
        if (this._options.sortingParameters[key].parameterName === null) {
            this._resetSorting();
            this._selectedKeys = [key];
        } else {
            return false;
        }
    }
    private _setSorting(param: string, value: string): void {
        const newSorting = [];
        newSorting[0] = {};
        newSorting[0][param] = value;
        this._notify('sortingChanged', [newSorting]);
    }
    private _switchSorting(): void {
        const newValue: string = this._currentValue === 'ASC' ? 'DESC' : 'ASC';
        this._setSorting(this._currentParameterName, newValue);
    }
    private _itemArrowClick(e: SyntheticEvent<Event>, item: Record, value: 'ASC'|'DESC'): void {
        const param = item.get('parameterName');
        this._selectedKeys = [item.get('id')];
        this._children.dropdown.closeMenu();
        this._setSorting(param, value);
    }

    static _theme: [string] = ['Controls/grid'];
}

export default SortButton;
