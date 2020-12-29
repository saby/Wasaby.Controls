import {
    ICellPadding,
    IColumn,
    IColumnSeparatorSizeConfig,
    IHeaderCell,
    TColumnSeparatorSize,
    THeader
} from 'Controls/grid';
import Row, {IOptions as IRowOptions} from './Row';
import Header, {IHeaderBounds} from './Header';
import ItemActionsCell from './ItemActionsCell';
import HeaderCell from 'Controls/_display/grid/HeaderCell';
import { Model } from 'Types/entity';

export interface IOptions<T> extends IRowOptions<T> {
    header: THeader;
    headerModel: Header<T>;
}

export default class HeaderRow<T> extends Row<T> {
    protected _$header: THeader;
    protected _$headerModel: Header<T>;
    protected _$sorting: Array<{[p: string]: string}>;

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

    getBounds(): IHeaderBounds {
        return this._$headerModel.getBounds();
    }

    protected _initializeColumns(): void {
        if (this._$header) {
            this._$columnItems = [];
            const factory = this._getColumnsFactory();
            this._$columnItems = this._$header.map((column, index) => {
                const isFixed = typeof column.endColumn !== 'undefined' ?
                    (column.endColumn - 1) <= this.getStickyColumnsCount() : index < this.getStickyColumnsCount();

                return factory({
                    column,
                    isFixed,
                    sorting: this._getSortingBySortingProperty(column.sortingProperty),
                    cellPadding: this._getCellPaddingForHeaderColumn(column, index),
                    columnSeparatorSize: this._getColumnSeparatorSizeForColumn(column, index)
                });
            });
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
        if (this._$owner.hasMultiSelectColumn()) {
            const {start, end} = this._$headerModel.getBounds().row;
            this._$columnItems.unshift(factory({
                column: {
                    startRow: start,
                    endRow: end,
                    startColumn: 1,
                    endColumn: 2
                },
                isFixed: true
            }));
        }
    }

    protected _getCellPaddingForHeaderColumn(headerColumn: IHeaderCell, columnIndex: number): ICellPadding {
        const columns = this.getColumnsConfig();
        const headerColumnIndex =
            typeof headerColumn.startColumn !== 'undefined' ? headerColumn.startColumn - 1 : columnIndex;
        return columns[headerColumnIndex].cellPadding;
    }

    protected _updateColumnSeparatorSizeInColumns(): void {
        this._$header.forEach((column, columnIndex) => {
            const multiSelectOffset = this.hasMultiSelectColumn() ? 1 : 0;
            const cell = this._$columnItems[columnIndex + multiSelectOffset];
            cell.setColumnSeparatorSize(
                this._getColumnSeparatorSizeForColumn(column, columnIndex)
            );
        });
    }

    protected _getColumnSeparatorSizeForColumn(column: IHeaderCell, columnIndex: number): TColumnSeparatorSize {
        const currentColumn = {
            ...column,
            columnSeparatorSize: this._getHeaderColumnSeparatorSize(column, columnIndex)
        } as IColumn;
        let previousColumn: IColumn;
        if (columnIndex > 0) {
            previousColumn = {
                ...this._$header[columnIndex - 1],
                columnSeparatorSize: this._getHeaderColumnSeparatorSize(this._$header[columnIndex - 1], columnIndex - 1)
            } as IColumn;
        }
        return this._resolveColumnSeparatorSize(currentColumn, previousColumn);
    }

    private _getHeaderColumnSeparatorSize(headerColumn: IHeaderCell, columnIndex: number): IColumnSeparatorSizeConfig {
        const columnSeparatorSize: IColumnSeparatorSizeConfig = {};
        const columns = this.getColumnsConfig();
        const columnLeftIndex =
            typeof headerColumn.startColumn !== 'undefined' ? headerColumn.startColumn - 1 : columnIndex;
        const columnRightIndex =
            typeof headerColumn.endColumn !== 'undefined' ? headerColumn.endColumn - 2 : columnIndex;
        const columnLeft = columns[columnLeftIndex];
        const columnRight = columns[columnRightIndex];
        if (columnLeft?.columnSeparatorSize?.hasOwnProperty('left')) {
            columnSeparatorSize.left = columnLeft.columnSeparatorSize.left;
        }
        if (columnRight?.columnSeparatorSize?.hasOwnProperty('right')) {
            columnSeparatorSize.right = columnRight.columnSeparatorSize.right;
        }
        return columnSeparatorSize;
    }

    setSorting(sorting: Array<{[p: string]: string}>): void {
        this._$sorting = sorting;
        this.getColumns().forEach((cell: HeaderCell<Model>) => {
            cell.setSorting(this._getSortingBySortingProperty(cell.getSortingProperty()));
        });
        this._nextVersion();
    }

    private _getSortingBySortingProperty(property: string): string {
        const sorting = this._$sorting;
        let sortingDirection;
        if (sorting && property) {
            sorting.forEach((elem) => {
                if (elem[property]) {
                    sortingDirection = elem[property];
                }
            });
        }
        return sortingDirection;
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
