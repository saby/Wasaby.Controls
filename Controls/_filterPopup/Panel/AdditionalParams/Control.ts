import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {factory} from 'Types/chain';
import Clone = require('Core/core-clone');
import * as template from 'wml!Controls/_filterPopup/Panel/AdditionalParams/Control/Control';
import {ICloneable} from 'Types/entity';
import {IEnumerable} from 'Types/collection';
import {object} from 'Types/util';

type IFilterItem = Record<string, any>;
type TAdditionalSource = ICloneable & IEnumerable<IFilterItem, string> | IFilterItem[];
interface IAdditionalRenderOptions extends IControlOptions {
    columnProperty: string;
    groupProperty: string;
    keyProperty: string;
    source: TAdditionalSource;
    itemVisibilityCallback: (item: IFilterItem) => boolean;
}

interface IAdditionalParamsColumns {
    right: number[];
    left: number[];
}

const MAX_COLUMN_ITEMS = 5;

export default class AdditionalParamsControl extends Control<IAdditionalRenderOptions> {
    protected _template: TemplateFunction = template;
    protected _source: TAdditionalSource = null;
    protected _visibleItems: IFilterItem[] = null;
    protected _additionalItems: IFilterItem[] = null;
    protected _columns: IAdditionalParamsColumns = null;
    protected _arrowVisible: boolean = false;
    protected _arrowExpanded: boolean = false;

    private _cloneItems(items: TAdditionalSource): TAdditionalSource {
        if (items['[Types/_entity/CloneableMixin]']) {
            return (items as ICloneable).clone();
        }
        return Clone(items);
    }

    private _getVisibleItems(items: TAdditionalSource): IFilterItem[] {
        return factory(items).filter((item: IFilterItem) =>  {
            return object.getPropertyValue(item, 'visibility') === false;
        }).value();
    }

    private _getArrowVisible(columns: IAdditionalParamsColumns): boolean {
        return columns.left.length > MAX_COLUMN_ITEMS || columns.right.length > MAX_COLUMN_ITEMS;
    }

    private _getColumns(items: TAdditionalSource): IAdditionalParamsColumns {
        const countColumnItems = items.length / 2;
        const columns = {
            right: [],
            left: []
        };

        factory(items).each((item) => {
            if (object.getPropertyValue(item, 'visibility') !== undefined) {
                if (columns.left.length < countColumnItems) {
                    columns.left.push(item.name);
                } else {
                    columns.right.push(item.name);
                }
            }
        });

        return columns;
    }

    private _prepareColumns(items: IFilterItem[], columns: IAdditionalParamsColumns): void {
        items.forEach((item: IFilterItem): void => {
            if (columns.left.includes(item.name)) {
                item.column = 'left';
            } else {
                item.column = 'right';
            }
        });
    }

    private _getAdditionalItems(items: TAdditionalSource): IFilterItem[] {
        return factory(items).filter((item: IFilterItem) =>  {
            return object.getPropertyValue(item, 'visibility') !== undefined;
        }).value();
    }

    protected _beforeMount(options: IAdditionalRenderOptions): void {
        this._source = this._cloneItems(options.source);
        this._additionalItems = this._getAdditionalItems(this._source);
        if (!options.groupProperty) {
            this._columns = this._getColumns(this._additionalItems);
            this._prepareColumns(this._additionalItems, this._columns);
            this._visibleItems = this._getVisibleItems(this._additionalItems);
            this._arrowVisible = this._getArrowVisible(this._columns);
        } else {
            this._visibleItems = this._getVisibleItems(this._source);
        }
    }

    protected _beforeUpdate(options: IAdditionalRenderOptions): void {
        if (this._options.source !== options.source) {
            this._source = this._cloneItems(options.source);
            this._additionalItems = this._getAdditionalItems(this._source);
            if (!options.groupProperty) {
                this._columns = this._getColumns(this._additionalItems);
                this._prepareColumns(this._additionalItems, this._columns);
                this._visibleItems = this._getVisibleItems(this._additionalItems);
                this._arrowVisible = this._getArrowVisible(this._columns);
            } else {
                this._visibleItems = this._getVisibleItems(this._source);
            }
        }
    }

    protected _findItemIndex(items: TAdditionalSource, key: string, keyProperty: string): number {
        let resultIndex = null;
        factory(items).each((item: IFilterItem, index: string | number): void => {
            if (object.getPropertyValue(item, keyProperty) === key) {
                resultIndex = index;
            }
        });

        return resultIndex;
    }

    protected _arrowClick(): void {
        this._arrowExpanded = !this._arrowExpanded;
    }

    protected _updateItem(event: Event, item: any, property: IFilterItem, value: string): void {
        const index = this._findItemIndex(this._source, item[this._options.keyProperty], this._options.keyProperty);
        this._source[index][property] = value;
        this._source[index].visibility = true;
        this._notify('sourceChanged', [this._source]);
    }

    static _theme: string[] = ['Controls/filterPopup'];
    static getDefaultOptions(): object {
        return {
            render: 'Controls/filterPopup:AdditionalPanelTemplate'
        };
    }
}
