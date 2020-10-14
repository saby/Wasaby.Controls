import { mixin } from 'Types/util';
import { OptionsToPropertyMixin } from 'Types/entity';
import { THeader } from "../_grid/interface/IHeaderCell";
import GridCollection from './GridCollection';
import GridHeaderCell from './GridHeaderCell';

export interface IOptions<T> {
    owner: GridCollection<T>;
    header: THeader;
}

type THeaderCells<T> = GridHeaderCell<T>[];

export default class GridHeader<T> extends mixin<OptionsToPropertyMixin>(OptionsToPropertyMixin) {
    protected _$owner: GridCollection<T>;
    protected _$headerCells: THeaderCells<T>;

    constructor(options?: IOptions<T>) {
        super();
        OptionsToPropertyMixin.call(this, options);
    }

    /*constructor(options?: IOptions<T>) {
        super(options);
        const addMultiSelectColumn = this.getMultiSelectVisibility() !== 'hidden';
        if (this._$columns) {
            const factory = this._getColumnsFactory();
            this._$columnItems = this._$columns.map((column) => factory({ column }));
            if (addMultiSelectColumn) {
                this._$columnItems = [
                    factory({ column: {} })
                ].concat(this._$columnItems);
            }
        }
    }

    getColumns(): Array<GridColumn<T>> {
        return this._$columnItems;
    }

    getColumnsCount(): number {
        return this._$columnItems.length;
    }

    getColumnIndex(column: GridColumn<T>): number {
        return this._$columnItems.indexOf(column);
    }

    getTopPadding(): string {
        return this._$owner.getTopPadding().toLowerCase();
    }

    getBottomPadding(): string {
        return this._$owner.getBottomPadding().toLowerCase();
    }

    getLeftPadding(): string {
        return this._$owner.getLeftPadding().toLowerCase();
    }

    getRightPadding(): string {
        return this._$owner.getRightPadding().toLowerCase();
    }

    getItemSpacing(): { left: string, right: string, row: string } {
        return {
            left: this._$owner.getLeftPadding().toLowerCase(),
            right: this._$owner.getRightPadding().toLowerCase(),
            row: this._$owner.getTopPadding().toLowerCase()
        };
    }

    // region overrides

    setMarked(marked: boolean, silent?: boolean): void {
        const changed = marked !== this.isMarked();
        super.setMarked(marked, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    setActive(active: boolean, silent?: boolean): void {
        const changed = active !== this.isActive();
        super.setActive(active, silent);
        if (changed) {
            this._redrawColumns('all');
        }
    }

    // endregion

    protected _redrawColumns(target: 'first'|'last'|'all'): void {
        switch (target) {
            case 'first':
                this._$columnItems[0].nextVersion();
                break;
            case 'last':
                this._$columnItems[this.getColumnsCount() - 1].nextVersion();
                break;
            case 'all':
                this._$columnItems.forEach((column) => column.nextVersion());
                break;
        }
    }

    protected _getColumnsFactory(): (options: Partial<IGridColumnOptions<T>>) => GridColumn<T> {
        return (options) => {
            options.owner = this;
            return new GridColumn(options as IGridColumnOptions<T>);
        };
    }*/
}

Object.assign(GridHeader.prototype, {
    _moduleName: 'Controls/display:GridHeader',
    _$headerCells: null
});

