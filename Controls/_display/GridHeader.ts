import GridCollection from './GridCollection';
import GridHeaderRow, {IOptions as IGridHeaderRowOptions} from './GridHeaderRow';
import { create } from 'Types/di';

export interface IOptions<T> extends IGridHeaderRowOptions<T> {}

export default class GridHeader<T> {
    protected _$owner: GridCollection<T>;
    protected _$rows: Array<GridHeaderRow<T>>;

    constructor(options: IOptions<T>) {
        this._$owner = options.owner;
        this._$rows = this._initializeRows(options);
    }

    protected _initializeRows(options: IOptions<T>): Array<GridHeaderRow<T>> {
        const factory = this._getRowsFactory();
        return [new factory(options)];
    }

    getRow(index?: number): GridHeaderRow<T> {
        if (!(this._$owner.isFullGridSupport() && typeof index === 'undefined')) {
            throw Error('Method can be used only in browsers with full grid support!');
        }
        return this._$rows[0];
    }

    getRows(): Array<GridHeaderRow<T>> {
        return this._$rows;
    }

    isMultiline(): boolean {
        return this._$rows.length > 1;
    }

    isSticked(): boolean {
        return this._$owner.isStickyHeader() && this._$owner.isFullGridSupport();
    }

    protected _getRowsFactory(): new () => GridHeaderRow<T> {
        return (options: IOptions<T>) => {
            options.headerModel = this;
            return create(this._rowModule, options as IGridHeaderRowOptions<T>);
        };
    }
}

Object.assign(GridHeader.prototype, {
    _moduleName: 'Controls/display:GridHeader',
    _instancePrefix: 'grid-header-',
    _rowModule: 'Controls/display:GridHeaderRow',
    _cellModule: 'Controls/display:GridHeaderCell',
    _$header: null
});
