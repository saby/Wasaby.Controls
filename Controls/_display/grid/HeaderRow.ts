import {THeader} from 'Controls/grid';
import Row, {IOptions as IRowOptions} from './Row';
import Header from './Header';
import ItemActionsCell from './ItemActionsCell';
import StickyLadderCell from 'Controls/_display/grid/StickyLadderCell';
import Cell from 'Controls/_display/grid/Cell';
import HeaderCell from 'Controls/_display/grid/HeaderCell';

export interface IOptions<T> extends IRowOptions<T> {
    header: THeader;
    headerModel: Header<T>
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
        return 'header' as unknown as T
    }

    getItemClasses(params): string {
        return `controls-Grid__header controls-Grid__header_theme-${params.theme}`;
    }

    protected _processStickyLadderCells(): void {
        // todo Множественный stickyProperties можно поддержать здесь:
        const stickyLadderProperties = this.getStickyLadderProperties(this._$columns[0]);
        const stickyLadderCellsCount = stickyLadderProperties && stickyLadderProperties.length || 0;

        if (stickyLadderCellsCount) {
            this._$columnItems.splice(1, 0, new HeaderCell({
                column: this._$header[0],
                ladderCell: true,
                owner: this,
                backgroundStyle: 'transparent',
                shadowVisibility: 'hidden'
            }));
        }

        if (stickyLadderCellsCount === 2) {
            this._$columnItems = ([
                new HeaderCell({
                    column: this._$header[0],
                    ladderCell: true,
                    owner: this,
                    shadowVisibility: 'hidden',
                    backgroundStyle: 'transparent'
                })
            ] as Array<Cell<T, Row<T>>>).concat(this._$columnItems);
        }
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
                    isFixed
                });
            });

            this._processStickyLadderCells();
            this._addCheckBoxColumnIfNeed();

            if (this.hasItemActionsSeparatedCell()) {
                this._$columnItems.push(new ItemActionsCell({
                    owner: this,
                    column: {}
                }))
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
}

Object.assign(HeaderRow.prototype, {
    '[Controls/_display/grid/HeaderRow]': true,
    _moduleName: 'Controls/display:GridHeaderRow',
    _instancePrefix: 'grid-header-row-',
    _cellModule: 'Controls/display:GridHeaderCell',
    _$header: null,
    _$headerModel: null
});
