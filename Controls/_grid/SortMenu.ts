import template = require('wml!Controls/_grid/SortResources/SortMenu');
import 'css!theme?Controls/grid';
import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {ICrud, Memory} from 'Types/source';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Record} from 'Types/entity';
import {isEqual} from 'Types/object';

/**
 * Контрол в виде выпадающего меню, используюемый для изменения сортировки.
 *
 * @class Controls/grid:SortMenu
 * @extends Core/Control
 * @mixes Controls/_interface/ISorting
 * @public
 */

/**
 * @typedef {Object} SortingParameter Объект, содержащий данные о поле для сортировки и название, для отображения в выпадающем списке.
 * @property {String|null} paramName Поле для сортировки. Чтобы задать сброс сортировки, нужно указать значение null
 * @property {String} title Название, для отображения параметра в выпадающем списке
 */

/**
 * @name Controls/grid:SortMenu#sortingParams Массив, сожержащий данные для меню с вариантами сортировки.
 * @cfg {Array<SortingParameter>}
 */

export interface ISortingParameter {
    paramName: string | null;
    title: string;
}

export interface ISortMenuOptions extends IControlOptions {
   sortingParams: [ISortingParameter];
   sorting: [object];
   header: string;
}

class SortMenu extends Control<ISortMenuOptions> {
    protected _template: TemplateFunction = template;
    private _selectedKeys: [number|string];
    private _source: ICrud = null;
    private _currentParamName: string = null;
    private _currentValue: 'ASC'|'DESC' = null;

    protected _beforeMount(options: ISortMenuOptions): void {
        this.updateConfig(options.sortingParams, options.sorting);
    }

    protected  _beforeUpdate(newOptions: ISortMenuOptions): void {
        if (!isEqual(this._options.sorting, newOptions.sorting) ||
            !isEqual(this._options.sortingParams, newOptions.sortingParams)) {
            this.updateConfig(newOptions.sortingParams, newOptions.sorting);
        }
    }

    private updateConfig(sortingParams: [ISortingParameter], sorting: [object]|undefined): void {
        const data = [];

        if (sorting && sorting.length) {
            this._currentParamName = Object.keys(sorting[0])[0];
            this._currentValue = sorting[0][this._currentParamName];
        } else {
            this._currentParamName = null;
            this._currentValue = null;
        }
        sortingParams.forEach((item: ISortingParameter, i: number) => {
            const dataElem = {...item, id: i, value: '', readOnly: true};
            if (dataElem.paramName === this._currentParamName) {
                if (this._currentValue !== null) {
                    dataElem.value = this._currentValue;
                }
                this._selectedKeys = [i];
            }
            if (item.paramName === null) {
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
        if (this._options.sortingParams[key].paramName === null) {
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
        this._setSorting(this._currentParamName, newValue);
    }
    private _changeSorting(e: SyntheticEvent<Event>, item: Record, value: 'ASC'|'DESC'): void {
        const param = item.get('paramName');
        this._selectedKeys = [item.get('id')];
        this._children.dropdown.closeMenu();
        this._setSorting(param, value);
    }

    static _theme: [string] = ['Controls/grid'];
}

export default SortMenu;
