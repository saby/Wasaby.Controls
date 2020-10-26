import Collection, { ItemsFactory, IOptions as IBaseOptions } from './Collection';
import GridCollectionItem, { IOptions as IGridCollectionItemOptions } from './GridCollectionItem';
import { TemplateFunction } from 'UI/Base';
import { TColumns } from '../_grid/interface/IColumn';
import { THeader } from "../_grid/interface/IHeaderCell";
import GridHeader from "./GridHeader";
import GridResults from "./GridResults";
import GridFooter from "./GridFooter";

type TResultsPosition = 'top' | 'bottom';

export interface IOptions<
    S,
    T extends GridCollectionItem<S> = GridCollectionItem<S>
> extends IBaseOptions<S, T> {
    columns: TColumns;
    footerTemplate: TemplateFunction;
    header: THeader;
    resultsPosition: TResultsPosition;
}

export default class GridCollection<
    S,
    T extends GridCollectionItem<S> = GridCollectionItem<S>
> extends Collection<S, T> {
    protected _$columns: TColumns;
    protected _$header: GridHeader<S>;
    protected _$footer: GridFooter<S>;
    protected _$results: GridResults<S>;
    protected _$resultsPosition: TResultsPosition;

    constructor(options: IOptions<S, T>) {
        super(options);
        if (options.header && options.header.length) {
            this._$header = this._initializeHeader(options);
        }
        if (options.footerTemplate) {
            this._$footer = this._initializeFooter(options);
        }
        this._$resultsPosition = options.resultsPosition;
        if (this._$resultsPosition) {
            this._$results = this._initializeResults(options);
        }
    }

    getColumns(): TColumns {
        return this._$columns;
    }

    getHeader(): GridHeader<S> {
        return this._$header;
    }

    getFooter(): GridFooter<S> {
        return this._$footer;
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

    protected _initializeFooter(options): GridFooter<S> {
        return new GridFooter({
            owner: this,
            footerTemplate: options.footerTemplate
        });
    }

    protected _initializeResults(options): GridResults<S> {
        return new GridResults({
            owner: this,
            results: this.getMetaResults(),
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
