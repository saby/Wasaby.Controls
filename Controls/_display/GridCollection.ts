import Collection, { ItemsFactory, IOptions as IBaseOptions } from './Collection';
import GridRow, { IOptions as IGridRowOptions } from './GridRow';
import GridGroupItem from './GridGroupItem';
import { TemplateFunction } from 'UI/Base';
import { TColumns, THeader } from 'Controls/grid';
import * as GridLadderUtil from './utils/GridLadderUtil';
import GridColgroup from './GridColgroup';
import GridHeader from './GridHeader';
import GridResultsRow, { TResultsPosition } from './GridResultsRow';
import GridFooterRow from './GridFooterRow';

export interface IOptions<
    S,
    T extends GridRow<S> = GridRow<S>
> extends IBaseOptions<S, T> {
    columns: TColumns;
    footerTemplate?: TemplateFunction;
    // TODO: Написать интерфейс и доку для TFooter
    footer?: TFooter;
    header?: THeader;
    resultsTemplate?: TemplateFunction;
    resultsPosition?: TResultsPosition;
    headerInEmptyListVisible?: boolean;
    ladderProperties?: string[];
    stickyColumn?: {};
}

export default class GridCollection<
    S,
    T extends GridRow<S> = GridRow<S>
> extends Collection<S, T> {
    protected _$columns: TColumns;
    protected _$colgroup: GridColgroup<S>;
    protected _$header: GridHeader<S>;
    protected _$footer: GridFooterRow<S>;
    protected _$results: GridResultsRow<S>;
    protected _$ladder: {};
    protected _$ladderProperties: string[];
    protected _$stickyColumn: {};
    protected _$resultsPosition: TResultsPosition;
    protected _$headerInEmptyListVisible: boolean;

    protected _$isFullGridSupport: boolean;

    constructor(options: IOptions<S, T>) {
        super(options);

        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
        }

        this._$headerInEmptyListVisible = options.headerInEmptyListVisible;
        this._$resultsPosition = options.resultsPosition;

        if (this._headerIsVisible(options)) {
            this._$header = this._initializeHeader(options);
        }
        if (options.footerTemplate || options.footer) {
            this._$footer = this._initializeFooter(options);
        }
        if (this._resultsIsVisible()) {
            this._$results = this._initializeResults(options);
        }
        if (!this._$isFullGridSupport) {
            this._$colgroup = this._initializeColgroup(options);
        }
    }

    getColumns(): TColumns {
        throw Error('GridCollection.getColumns is deprecated. Use GridCollection.getColumnsConfig');
    }

    getColumnsConfig(): TColumns {
        return this._$columns;
    }

    getColgroup(): GridColgroup<S> {
        return this._$colgroup;
    }

    getHeader(): GridHeader<S> {
        return this._$header;
    }

    getFooter(): GridFooterRow<S> {
        return this._$footer;
    }

    getResults(): GridResultsRow<S> {
        return this._$results;
    }

    getResultsPosition(): TResultsPosition {
        return this._$resultsPosition;
    }

    getEmptyTemplateClasses(theme?: string): string {
        const rowSeparatorSize = this.getRowSeparatorSize();
        let emptyTemplateClasses = 'controls-GridView__emptyTemplate js-controls-GridView__emptyTemplate';
        emptyTemplateClasses += ` controls-Grid__row-cell_withRowSeparator_size-${rowSeparatorSize}`;
        emptyTemplateClasses += ` controls-Grid__row-cell_withRowSeparator_size-${rowSeparatorSize}_theme-${theme}`;
        return emptyTemplateClasses;
    }

    getStickyColumn(): GridLadderUtil.IStickyColumn {
        return GridLadderUtil.getStickyColumn({
            stickyColumn: this._$stickyColumn,
            columns: this._$columns
        });
    }

    setColumns(newColumns: TColumns): void {
        this._$columns = newColumns;
        this._$colgroup?.reBuild();
        this._nextVersion();
        this._updateItemsColumns();
    }

    setMultiSelectVisibility(visibility: string): void {
        super.setMultiSelectVisibility(visibility);
        this._$colgroup?.reBuild();
    }

    protected _reBuild(reset?: boolean): void {
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties) && !!this._$ladder) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
        }
        super._reBuild(reset);
        this._$colgroup?.reBuild();
    }

    setIndexes(start: number, stop: number): void {
        super.setIndexes(start, stop);
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
        this._updateItemsColumns();
    }

    protected _handleAfterCollectionChange(): void {
        super._handleAfterCollectionChange();
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
    }

    protected _prepareLadder(ladderProperties: string[], columns: TColumns): void {
        this._$ladder = GridLadderUtil.prepareLadder({
            columns: columns,
            ladderProperties: ladderProperties,
            startIndex: this.getStartIndex(),
            stopIndex: this.getStopIndex(),
            display: this
        });
    }

    protected _updateItemsLadder(): void {
        this.getViewIterator().each((item: GridRow<T>) => {
            if (item['[Controls/_display/ILadderedCollectionItem]']) {
                item.setLadder(this._$ladder);
            }
        });
    }

    protected _updateItemsColumns(): void {
        this.getViewIterator().each((item: GridRow<T>) => {
            if (item['[Controls/_display/ILadderedCollectionItem]']) {
                item.setColumns(this._$columns);
            }
        });
    }

    protected _headerIsVisible(options: IOptions<S>): boolean {
        const hasHeader = options.header && options.header.length;
        return hasHeader && (this._$headerInEmptyListVisible || this.getCollectionCount() > 0);
    }

    protected _resultsIsVisible(): boolean {
        const hasResultsPosition = !!this._$resultsPosition;
        const hasMoreData = this.getHasMoreData();
        return hasResultsPosition && (hasMoreData || this.getCollectionCount() > 1);
    }

    protected _initializeHeader(options: IOptions<S>): GridHeader<S> {
        return new GridHeader({
            owner: this,
            header: options.header
        });
    }

    protected _initializeFooter(options: IOptions<S>): GridFooterRow<S> {
        return new GridFooterRow({
            ...options,
            owner: this,
            footerTemplate: options.footerTemplate,
            footer: options.footer
        });
    }

    protected _initializeResults(options: IOptions<S>): GridResultsRow<S> {
        return new GridResultsRow({
            ...options,
            owner: this,
            results: this.getMetaResults(),
            resultsTemplate: options.resultsTemplate,
        });
    }

    protected _initializeColgroup(options: IOptions<S>): GridColgroup<S> {
        return new GridColgroup({
            owner: this
        });
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: IGridRowOptions<S>): T {
            options.columns = this._$columns;
            return superFactory.call(this, options);
        };
    }

    protected _getGroupItemConstructor(): new() => GridGroupItem<T> {
        return GridGroupItem;
    }
}

Object.assign(GridCollection.prototype, {
    '[Controls/_display/GridCollection]': true,
    _moduleName: 'Controls/display:GridCollection',
    _itemModule: 'Controls/display:GridDataRow',
    _$columns: null,
    _$headerInEmptyListVisible: false,
    _$resultsPosition: null,
    _$ladderProperties: null,
    _$stickyColumn: null,
    _$isFullGridSupport: true
});
