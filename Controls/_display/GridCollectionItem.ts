import CollectionItem, { IOptions as IBaseOptions } from './CollectionItem';
import GridCollection from './GridCollection';
import { register } from 'Types/di';
import GridColumn, { IOptions as IGridColumnOptions, IColumnConfig } from './GridColumn';

export interface IOptions<T> extends IBaseOptions<T> {
    owner: GridCollection<T>;
    columns: IColumnConfig[];
}

export default class GridCollectionItem<T> extends CollectionItem<T> {
    protected _$owner: GridCollection<T>;
    protected _$columns: IColumnConfig[];
    protected _$columnItems: Array<GridColumn<T>>;

    constructor(options?: IOptions<T>) {
        super(options);
        if (this._$columns) {
            const factory = this._getColumnsFactory();
            this._$columnItems = this._$columns.map((column) => factory({ column }));
        }
    }

    getColumns(): Array<GridColumn<T>> {
        return this._$columnItems;
    }

    protected _getColumnsFactory(): (options: Partial<IGridColumnOptions<T>>) => GridColumn<T> {
        return (options) => {
            options.owner = this;
            return new GridColumn(options as IGridColumnOptions<T>);
        };
    }
}

Object.assign(GridCollectionItem.prototype, {
    '[Controls/_display/GridCollectionItem]': true,
    _moduleName: 'Controls/display:GridCollectionItem',
    _instancePrefix: 'grid-item-',
    _$columns: null,
    _$columnItems: null
});

register('Controls/display:GridCollectionItem', GridCollectionItem, {instantiate: false});
