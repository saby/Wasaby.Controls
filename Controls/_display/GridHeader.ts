import { mixin } from 'Types/util';
import { OptionsToPropertyMixin } from 'Types/entity';
import { THeader} from '../_grid/interface/IHeaderCell';
import GridCollection from './GridCollection';
import GridHeaderCell from './GridHeaderCell';

export interface IOptions<T> {
    owner: GridCollection<T>;
    header: THeader;
}

type THeaderCells<T> = Array<GridHeaderCell<T>>;

export default class GridHeader<T> extends mixin<OptionsToPropertyMixin>(OptionsToPropertyMixin) {
    protected _$owner: GridCollection<T>;
    protected _$headerCells: THeaderCells<T>;

    constructor(options?: IOptions<T>) {
        super();
        OptionsToPropertyMixin.call(this, options);
        this._$headerCells = this._prepareCells(options.header);
    }

    getBodyClasses(theme: string): string {
        return `controls-Grid__header controls-Grid__header_theme-${theme}`;
    }

    getCells(): THeaderCells<T> {
        return this._$headerCells;
    }

    getCellIndex(headerCell: GridHeaderCell<T>): number {
        return this._$headerCells.indexOf(headerCell);
    }

    getColumnsCount(): number {
        return this._$headerCells.length;
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

    getMultiSelectVisibility(): string {
        return this._$owner.getMultiSelectVisibility();
    }

    isStickyHeader(): boolean {
        return this._$owner.isStickyHeader();
    }

    protected _prepareCells(header: THeader): THeaderCells<T> {
        const headerCells = [];
        // todo add multiSelect cell
        header.forEach((elem) => {
            const headerCell = new GridHeaderCell({
                headerCell: elem,
                owner: this
            });
            headerCells.push(headerCell);
        });
        return headerCells;
    }
}

Object.assign(GridHeader.prototype, {
    _moduleName: 'Controls/display:GridHeader',
    _$owner: null
});
