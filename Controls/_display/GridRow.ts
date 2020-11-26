import CollectionItem, {IOptions as IBaseOptions} from './CollectionItem';
import GridCollection from './GridCollection';
import GridCell, { IOptions as IGridCellOptions } from './GridCell';
import { IColumn, TColumns } from 'Controls/grid';
import GridCheckboxCell from './GridCheckboxCell';
import GridHeader from './GridHeader';
import { TResultsPosition } from './GridResults';
import GridStickyLadderColumn from './GridStickyLadderColumn';
import {create} from 'Types/di';
import {TemplateFunction} from "UI/_base/Control";
import isFullGridSupport from './utils/GridSupportUtil';

export interface IOptions<T> extends IBaseOptions<T> {
    owner: GridCollection<T>;
    columns: TColumns;
}

export default class GridRow<T> extends CollectionItem<T> {
    protected _$owner: GridCollection<T>;
    protected _cellModule: string;

    protected _$columns: TColumns;
    protected _$columnItems: Array<GridCell<T, this>>;
    protected _$ladder: {};

    readonly '[Controls/_display/ILadderedCollectionItem]': boolean = true;

    constructor(options?: IOptions<T>) {
        super(options);
    }

    getTemplate(): TemplateFunction|string {
        return 'Controls/gridNew:ItemTemplate';
    }

    getItemClasses(templateHighlightOnHover: boolean = true,
                   theme: string = 'default',
                   style: string = 'default',
                   cursor: string = 'pointer',
                   clickable: boolean = true): string {
        const navigation = this.getOwner().getNavigation();
        const isLastItem = (!navigation || navigation.view !== 'infinity' || !this.getOwner().getHasMoreData())
            && this.isLastItem();
        let itemClasses = `controls-ListView__itemV ${this._getCursorClasses(cursor, clickable)}`;

        itemClasses += ` controls-Grid__row controls-Grid__row_${style}_theme-${theme}`;

        if (templateHighlightOnHover !== false && !this.isEditing()) {
            itemClasses += ` controls-Grid__row_highlightOnHover_${style}_theme-${theme}`;
        }

        if (isLastItem) {
            itemClasses += ' controls-Grid__row_last';
        }

        return itemClasses;
    }

    isLastItem(): boolean {
        return (this.getOwner().getItems()[this.getOwner().getCount() - 1] === this);
    }

    getHeader(): GridHeader<T> {
        return this._$owner.getHeader();
    }

    getResultsPosition(): TResultsPosition {
        return this._$owner.getResultsPosition();
    }

    // region Аспект "Ячейки строки"
    protected _getColumnsFactory(): (options: Partial<IGridCellOptions<T>>) => GridCell<T> {
        if (!this._cellModule) {
            throw new Error('Controls/_display/GridRow:_getColumnsFactory can not resolve cell module!');
        }
        return (options) => {
            options.owner = this;
            return create(this._cellModule, options as IGridCellOptions<T>);
        };
    }

    setColumns(newColumns: TColumns): void {
        if (this._$columns !== newColumns) {
            this._$columns = newColumns;
            this._nextVersion();
            this._reinitializeColumns();
        }
    }

    getColumns(): Array<GridCell<T>> {
        if (!this._$columnItems) {
            this._initializeColumns();
        }
        return this._$columnItems;
    }

    getColumnsCount(): number {
        return this.getColumns().length;
    }

    getColumnIndex(column: GridCell<T, this>): number {
        return this.getColumns().indexOf(column);
    }

    protected _reinitializeColumns(): void {
        if (this._$columnItems) {
            this._initializeColumns();
            this._nextVersion();
        }
    }

    protected _initializeColumns(): void {
        if (this._$columns) {
            const createMultiSelectColumn = this.getMultiSelectVisibility() !== 'hidden';
            // todo Множественный stickyProperties можно поддержать здесь:
            const stickyLadderProperties = this.getStickyLadderProperties(this._$columns[0]);
            const stickyLadderStyleForFirstProperty = stickyLadderProperties &&
                this._getStickyLadderStyle(this._$columns[0], stickyLadderProperties[0]);
            const stickyLadderStyleForSecondProperty = stickyLadderProperties && stickyLadderProperties.length === 2 &&
                this._getStickyLadderStyle(this._$columns[0], stickyLadderProperties[1]);
            const factory = this._getColumnsFactory();

            this._$columnItems = this._$columns.map((column) => factory({ column }));

            if (stickyLadderStyleForSecondProperty || stickyLadderStyleForFirstProperty) {
                this._$columnItems[0].setHiddenForLadder(true);
            }

            if (stickyLadderStyleForSecondProperty) {
                this._$columnItems.splice(1,0,new GridStickyLadderColumn({
                    column: this._$columns[0],
                    owner: this,
                    wrapperStyle: stickyLadderStyleForSecondProperty,
                    contentStyle: `left: -${this._$columns[0].width}; right: 0;`,
                    stickyProperty: stickyLadderProperties[1],
                    stickyHeaderZIndex: 1
                }));
            }

            if (stickyLadderStyleForFirstProperty) {
                this._$columnItems = ([
                    new GridStickyLadderColumn({
                        column: this._$columns[0],
                        owner: this,
                        wrapperStyle: stickyLadderStyleForFirstProperty,
                        contentStyle: stickyLadderStyleForSecondProperty ? `left: 0; right: -${this._$columns[0].width};` : '',
                        stickyProperty: stickyLadderProperties[0],
                        stickyHeaderZIndex: 2
                    })
                ] as GridColumn<T>[]).concat(this._$columnItems);
            }

            if (createMultiSelectColumn) {
                this._$columnItems = ([
                    new GridCheckboxCell({
                        column: {} as IColumn,
                        owner: this
                    })
                ] as GridCell<T, this>[]).concat(this._$columnItems);
            }
        }
    }

    protected _redrawColumns(target: 'first'|'last'|'all'): void {
        if (this._$columnItems) {
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
    }
    // endregion

    // region Аспект "Отступы вокруг строки"
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
    // endregion

    // region Аспект "Фон строки"
    getHoverBackgroundStyle(): string {
        return this._$owner.getHoverBackgroundStyle();
    }

    getEditingBackgroundStyle(): string {
        return this._$owner.getEditingBackgroundStyle();
    }
    // endregion

    // region Аспект "Лесенка"
    getStickyLadderProperties(column: IColumn): string[] {
        let stickyProperties = column && column.stickyProperty;
        if (stickyProperties && !(stickyProperties instanceof Array)) {
            stickyProperties = [stickyProperties];
        }
        return stickyProperties as string[];
    }

    shouldDrawLadderContent(ladderProperty: string, stickyProperty: string): boolean {
        const stickyLadder = this.getStickyLadder();
        const stickyProperties = this.getStickyLadderProperties(this._$columns[0]);

        if (!stickyLadder) {
            return true;
        }

        const index = stickyProperties.indexOf(stickyProperty);
        const hasMainCell = !!(stickyLadder[stickyProperties[0]].ladderLength);

        if (!this.getOwner().getItemsDragNDrop() && stickyProperty && ladderProperty && stickyProperty !== ladderProperty && (
            index === 1 && !hasMainCell || index === 0 && hasMainCell)) {
            return false;
        }
        return true;
    }
    getLadderWrapperClasses(ladderProperty: string, stickyProperty: string): string {
        let ladderWrapperClasses = 'controls-Grid__row-cell__ladder-content';
        const ladder = this.getLadder();
        const stickyLadder = this.getStickyLadder();
        const stickyProperties = this.getStickyLadderProperties(this._$columns[0]);
        const index = stickyProperties?.indexOf(stickyProperty);
        const hasMainCell = stickyLadder && !!(stickyLadder[stickyProperties[0]].ladderLength);

        if (stickyProperty && ladderProperty && stickyProperty !== ladderProperty && (
            index === 1 && !hasMainCell || index === 0 && hasMainCell)) {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_displayNoneForLadder';
        }

        if (stickyProperty === ladderProperty && index === 1 && hasMainCell) {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_additional-with-main';
        }

        if (!ladder || !ladder[ladderProperty] || (stickyProperty === ladderProperty || !stickyProperty) && ladder[ladderProperty].ladderLength >= 1) {

        } else {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_hiddenForLadder';
        }
        return ladderWrapperClasses;
    }

    setLadder(ladder: {}) {
        if (this._$ladder !== ladder) {
            this._$ladder = ladder;
            this._reinitializeColumns();
        }
    }

    getLadder(): {} {
        let result;
        if (this._$ladder && this._$ladder.ladder) {
            result = this._$ladder.ladder[this._$owner.getIndex(this)];
        }
        return result;
    }

    getStickyLadder(): {} {
        let result;
        if (this._$ladder && this._$ladder.stickyLadder) {
            result = this._$ladder.stickyLadder[this._$owner.getIndex(this)];
        }
        return result;
    }

    protected _getStickyLadderStyle(column: IColumn, stickyProperty: string): string {
        const stickyLadder = this.getStickyLadder();
        return stickyLadder && stickyLadder[stickyProperty].headingStyle;
    }
    // endregion

    // region Аспект "Маркер"

    setMarked(marked: boolean, silent?: boolean): void {
        const changed = marked !== this.isMarked();
        super.setMarked(marked, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    // endregion

    // region Аспект "Множественный выбор"
    setMultiSelectVisibility(multiSelectVisibility: string): boolean {
        const isChangedMultiSelectVisibility = super.setMultiSelectVisibility(multiSelectVisibility)
        if (isChangedMultiSelectVisibility) {
            this._reinitializeColumns();
        }
        return isChangedMultiSelectVisibility;
    }

    setSelected(selected: boolean|null, silent?: boolean): void {
        const changed = this._$selected !== selected;
        super.setSelected(selected, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }
    // endregion

    // region Аспект "Активный элемент"
    setActive(active: boolean, silent?: boolean): void {
        const changed = active !== this.isActive();
        super.setActive(active, silent);
        if (changed) {
            this._redrawColumns('all');
        }
    }
    // endregion
}

Object.assign(GridRow.prototype, {
    '[Controls/_display/GridRow]': true,
    _moduleName: 'Controls/display:GridRow',
    _cellModule: null,
    _instancePrefix: 'grid-row-',
    _$columns: null,
    _$columnItems: null
});
