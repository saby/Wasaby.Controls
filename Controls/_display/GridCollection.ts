import Collection, { ItemsFactory, IOptions as IBaseOptions } from './Collection';
import GridCollectionItem, { IOptions as IGridCollectionItemOptions } from './GridCollectionItem';
import { IColumn } from '../_grid/interface/IColumn';
import { THeader } from "../_grid/interface/IHeaderCell";
import GridHeader from "./GridHeader";
import GridResults from "./GridResults";

type TResultsPosition = 'top' | 'bottom';

export interface IOptions<
    S,
    T extends GridCollectionItem<S> = GridCollectionItem<S>
> extends IBaseOptions<S, T> {
    columns: IColumn[];
    header: THeader;
    resultsPosition: TResultsPosition;
}

export default class GridCollection<
    S,
    T extends GridCollectionItem<S> = GridCollectionItem<S>
> extends Collection<S, T> {
    protected _$columns: IColumn[];
    protected _$header: GridHeader<S>;
    protected _$results: GridResults<S>;
    protected _$resultsPosition: TResultsPosition;

    constructor(options: IOptions<S, T>) {
        super(options);
        this._$resultsPosition = options.resultsPosition;
        if (options.header && options.header.length) {
            this._$header = this._initializeHeader(options);
        }
        if (this._$resultsPosition) {
            this._$results = this._initializeResults(options);
        }
    }

    getColumns(): IColumn[] {
        return this._$columns;
    }

    getHeader(): GridHeader<S> {
        return this._$header;
    }

    getResults(): GridResults<S> {
        return this._$results;
    }

    getResultsPosition(): TResultsPosition {
        return this._$resultsPosition;
    }

    protected _initializeHeader(options): GridHeader<S> {
        return new GridHeader({
            owner: this,
            header: options.header
        });
    }

    protected _initializeResults(options): GridResults<S> {
        return new GridResults({
            owner: this,
            results: this.getMetaResults(),
            columns: options.columns,
            resultsTemplate: options.resultsTemplate
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
