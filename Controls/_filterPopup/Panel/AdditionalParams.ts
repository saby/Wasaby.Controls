import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {object} from 'Types/util';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Collection, CollectionItem, GroupItem} from 'Controls/display';
import Clone = require('Core/core-clone');
import * as template from 'wml!Controls/_filterPopup/Panel/AdditionalParams/Control/Control';
import {factory} from 'Types/chain';
import {ICloneable} from 'Types/entity';
import {IEnumerable} from 'Types/collection';

/**
 * Control "Additional params". Used in the filter panel.
 * @class Controls/_filterPopup/Panel/AdditionalParams
 * @extends Core/Control
 * @control
 * @private
 * @author Герасимов А.М.
 */

const MAX_NUMBER_ITEMS_COLUMN = 5;
type IFilterItem = Record<string, any>;
type IFilterItemsCollection = ICloneable & IEnumerable<IFilterItem, string> | IFilterItem[];
interface IAdditionalParamsOptions extends IControlOptions {
    items: IFilterItemsCollection;
    groupProperty: string;
}

export default class AdditionalParams extends Control<IAdditionalParamsOptions> {
    protected _template: TemplateFunction = template;
    protected _items: IFilterItemsCollection = [];
    protected _collection: Collection<IFilterItem> = null;
    protected _columns: IAdditionalColumns = null;
    protected _arrowVisible: boolean = false;
    protected _isMaxHeight: boolean = false;

    private _itemsChanged(items: IFilterItemsCollection): void {
        this._notify('itemsChanged', [items]);
    }

    private _needShowArrow({leftColumn, rightColumn}: IAdditionalColumns): boolean {
        return leftColumn > MAX_NUMBER_ITEMS_COLUMN || rightColumn > MAX_NUMBER_ITEMS_COLUMN;
    }

    private _updateItem(index: number, field: string, value: any): void {
        const items = this._cloneItems(this._options.items);
        items[index][field] = value;
        items[index].visibility = true;
        this._itemsChanged(items);
    }

    private _clickSeparatorHandler(): void {
        this._isMaxHeight = true;
    }

    private _onResize(): void {
        this._arrowVisible = this._needShowArrow(this._columns);
    }

    protected _beforeMount(options: IAdditionalParamsOptions): void {
        this._items = this._cloneItems(options.items);
        this._columns = this._calculateColumns(this._items);
        this._arrowVisible = this._needShowArrow(this._columns);
    }

    protected _beforeUpdate(options: IAdditionalParamsOptions): void {
        if (this._options.items !== options.items) {
            this._items = this._cloneItems(options.items);
            this._columns = this._calculateColumns(this._items);
            this._arrowVisible = this._needShowArrow(this._columns);
        }
    }

    protected _itemChanged(event: SyntheticEvent<Event>, index: number, property: string, value: any): void {
        this._updateItem(index, property, value);
    }

    static _theme: string[] = ['Controls/filterPopup'];
}
