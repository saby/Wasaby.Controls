import Collection, { ItemsFactory, IOptions as IBaseOptions } from './Collection';
import GridCollectionItem, { IOptions as IGridCollectionItemOptions } from './GridCollectionItem';
import { IColumnConfig } from './GridColumn';
import { THeader } from "../_grid/interface/IHeaderCell";
import GridHeader from "./GridHeader";

export interface IOptions<
    S,
    T extends GridCollectionItem<S> = GridCollectionItem<S>
> extends IBaseOptions<S, T> {
    columns: IColumnConfig[];
    header: THeader;
}

export default class GridCollection<
    S,
    T extends GridCollectionItem<S> = GridCollectionItem<S>
> extends Collection<S, T> {
    protected _$columns: IColumnConfig[];
    protected _$header: GridHeader<S>;

    constructor(options: IOptions<S, T>) {
        super(options);
        if (options.header && options.header.length) {
            this._$header = this._initializeHeader(options);
        }
    }

    getColumns(): IColumnConfig[] {
        return this._$columns;
    }

    getHeader(): GridHeader<S> {
        return this._$header;
    }

    protected _initializeHeader(options): GridHeader<S> {
        return new GridHeader({
            owner: this,
            header: options.header
        });
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: IGridCollectionItemOptions<S>): T {
            options.columns = this._$columns;
            return superFactory.call(this, options);
        };
    }
}

Object.assign(GridCollection.prototype, {
    '[Controls/_display/GridCollection]': true,
    _moduleName: 'Controls/display:GridCollection',
    _itemModule: 'Controls/display:GridCollectionItem',
    _$columns: null
});
