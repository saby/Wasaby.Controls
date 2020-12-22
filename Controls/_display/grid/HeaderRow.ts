import {IColumn, IColumnSeparatorSizeConfig, IHeaderCell, TColumnSeparatorSize, THeader} from 'Controls/grid';
import Row, {IOptions as IRowOptions} from './Row';
import Header from './Header';
import ItemActionsCell from './ItemActionsCell';

export interface IOptions<T> extends IRowOptions<T> {
    header: THeader;
    headerModel: Header<T>;
}

export default class HeaderRow<T> extends Row<T> {
    protected _$header: THeader;
    protected _$headerModel: Header<T>;

    constructor(options?: IOptions<T>) {
        super(options);
    }

    getIndex(): number {
        return this._$owner.getRowIndex(this);
    }

    isSticked(): boolean {
        return this._$headerModel.isSticked();
    }

    isMultiline(): boolean {
        return this._$headerModel.isMultiline();
    }

    getContents(): T {
        return 'header' as unknown as T;
    }

    getItemClasses(params): string {
        return `controls-Grid__header controls-Grid__header_theme-${params.theme}`;
    }

    protected _initializeColumns(): void {
        if (this._$header) {
            this._$columnItems = [];
            const factory = this._getColumnsFactory();
            this._$columnItems = this._$header.map((column) => factory({
                column,
                columnSeparatorSize: this._getColumnSeparatorSize(column)
            }));
            this._addCheckBoxColumnIfNeed();

            if (this.hasItemActionsSeparatedCell()) {
                this._$columnItems.push(new ItemActionsCell({
                    owner: this,
                    column: {}
                }));
            }
        }
    }

    protected _addCheckBoxColumnIfNeed(): void {
        const factory = this._getColumnsFactory();
        if (this._$owner.needMultiSelectColumn()) {
            const {start, end} = this._$headerModel.getBounds().row;
            this._$columnItems.unshift(factory({
                column: {
                    startRow: start,
                    endRow: end
                }
            }));
        }
    }

    protected _getColumnSeparatorSize(column: IHeaderCell, columnIndex: number): TColumnSeparatorSize {
        const currentColumn = {
            ...column,
            columnSeparatorSize: this._getHeaderColumnSeparatorSize(column)
        } as IColumn;
        let previousColumn: IColumn;
        if (columnIndex !== 0) {
            previousColumn = {
                ...this._$columns[columnIndex - 1],
                columnSeparatorSize: this._getHeaderColumnSeparatorSize(this._$columns[columnIndex - 1])
            } as IColumn;
        }
        return this._resolveColumnSeparatorSize(currentColumn, previousColumn);
    }

    private _getHeaderColumnSeparatorSize(headerColumn: IHeaderCell): IColumnSeparatorSizeConfig {
        const columnSeparatorSize: IColumnSeparatorSizeConfig = {};
        const columns = this.getColumnsConfig();
        const columnLeft = columns[headerColumn.startColumn - 1];
        const columnRight = columns[headerColumn.endColumn - 2];
        if (columnLeft?.columnSeparatorSize?.hasOwnProperty('left')) {
            columnSeparatorSize.left = columnLeft.columnSeparatorSize.left;
        }
        if (columnRight?.columnSeparatorSize?.hasOwnProperty('right')) {
            columnSeparatorSize.right = columnRight.columnSeparatorSize.right;
        }
        return columnSeparatorSize;
    }
}

Object.assign(HeaderRow.prototype, {
    '[Controls/_display/grid/HeaderRow]': true,
    _moduleName: 'Controls/display:GridHeaderRow',
    _instancePrefix: 'grid-header-row-',
    _cellModule: 'Controls/display:GridHeaderCell',
    _$header: null,
    _$headerModel: null
});
