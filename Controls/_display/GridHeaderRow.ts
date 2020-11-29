import { THeader} from 'Controls/grid';
import GridCollection from './GridCollection';
import GridRow from './GridRow';
import GridHeaderCell from './GridHeaderCell';

export interface IOptions<T> {
    owner: GridCollection<T>;
    header: THeader;
}


export default class GridHeaderRow<T> extends GridRow<T> {
    protected _$header: THeader;

    constructor(options?: IOptions<T>) {
        super(options);
    }

    getContents(): T {
        return 'header' as unknown as T
    }

    getItemClasses(templateHighlightOnHover: boolean = true,
                   theme: string = 'default',
                   style: string = 'default',
                   cursor: string = 'pointer',
                   clickable: boolean = true): string {
        return `controls-Grid__header controls-Grid__header_theme-${theme}`;
    }

    protected _initializeColumns(): void {
        if (this._$columns) {
            this._$columnItems = [];
            const factory = this._getColumnsFactory();
            this._$columnItems = this._$header.map((column) => factory({
                column,
                startColumn: column.startColumn,
                endColumn: column.endColumn
            }));
        }
    }

    protected _prepareCells(header: THeader): THeaderCells<T> {
        const cells = [];
        const columns = this._$owner.getColumnsConfig();
        if (this._$owner.getMultiSelectVisibility() !== 'hidden') {
            cells.push(new GridHeaderCell({
                headerCell: {},
                owner: this
            }));
        }
        header.forEach((elem, index) => {
            const cell = new GridHeaderCell({
                headerCell: elem,
                owner: this,
                cellPadding: columns[index].cellPadding
            });
            cells.push(cell);
        });
        return cells;
    }
}

Object.assign(GridHeaderRow.prototype, {
    _moduleName: 'Controls/display:GridHeader',
    _instancePrefix: 'grid-header-row-',
    _cellModule: 'Controls/display:GridFooterCell',
    _$header: null
});
