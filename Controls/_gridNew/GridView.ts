import { ListView } from 'Controls/list';
import { TemplateFunction } from 'UI/Base';
import { TouchContextField as isTouch } from 'Controls/context';
import { Logger} from 'UI/Utils';
import { GridRow, GridLadderUtil, GridLayoutUtil } from 'Controls/display';
import * as GridTemplate from 'wml!Controls/_gridNew/Render/grid/GridView';
import * as GridItem from 'wml!Controls/_gridNew/Render/grid/Item';
import * as GroupTemplate from 'wml!Controls/_gridNew/Render/GroupTemplate';
import { prepareEmptyEditingColumns, prepareEmptyColumns } from 'Controls/Utils/GridEmptyTemplateUtil';
import * as GridIsEqualUtil from 'Controls/Utils/GridIsEqualUtil';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    Controller as ColumnScroll,
    JS_SELECTORS as COLUMN_SCROLL_JS_SELECTORS
} from 'Controls/columnScroll'

const GridView = ListView.extend({
    _template: GridTemplate,
    _hoveredCellIndex: null,
    _hoveredCellItem: null,
    _groupTemplate: GroupTemplate,
    _isFullMounted: false,
    _columnScrollShadowClasses: null,

    _beforeMount(options): void {
        let result = GridView.superclass._beforeMount.apply(this, arguments);
        this._prepareColumnsForEmptyEditingTemplate = this._prepareColumnsForEmptyEditingTemplate.bind(this);
        this._prepareColumnsForEmptyTemplate = this._prepareColumnsForEmptyTemplate.bind(this);
        this._horizontalPositionChangedHandler = this._horizontalPositionChangedHandler.bind(this);

        return result;
    },

    _afterMount(): void {
        if (this._options.columnScroll) {
            this._actualizeColumnScroll(this._options, true);
        }
        this._isFullMounted = true;
    },

    _beforeUpdate(newOptions): void {
        GridView.superclass._beforeUpdate.apply(this, arguments);
        const columnsChanged = !GridIsEqualUtil.isEqualWithSkip(this._options.columns, newOptions.columns,
            { template: true, resultTemplate: true });
        if (columnsChanged) {
            this._listModel.setColumns(newOptions.columns, false);
        }
    },

    _resolveItemTemplate(options): TemplateFunction {
        return options.itemTemplate || this._resolveBaseItemTemplate(options);
    },

    _resolveBaseItemTemplate(options): TemplateFunction {
        return GridItem;
    },

    _getGridTemplateColumns(columns: Array<{width?: string}>, hasMultiSelect: boolean): string {
        if (!columns) {
            Logger.warn('You must set "columns" option to make grid work correctly!', this);
            return '';
        }
        const initialWidths = columns.map(((column) => column.width || GridLayoutUtil.getDefaultColumnWidth()));
        let columnsWidths: string[] = [];
        columnsWidths = initialWidths;
        const ladderStickyColumn = GridLadderUtil.getStickyColumn({
            columns
        });
        if (ladderStickyColumn) {
            if (ladderStickyColumn.property.length === 2) {
                columnsWidths.splice(1, 0, '0px');
            }
            columnsWidths = ['0px'].concat(columnsWidths);
        }
        if (hasMultiSelect) {
            columnsWidths = ['max-content'].concat(columnsWidths);
        }
        return GridLayoutUtil.getTemplateColumnsStyle(columnsWidths);
    },

    _getGridViewWrapperClasses(): string {
        return `${this._columnScrollContainerClasses} ${this.isColumnScrollVisible() ? COLUMN_SCROLL_JS_SELECTORS.COLUMN_SCROLL_VISIBLE : ''}`
    },

    _getGridViewWrapperStyles(): string {
        return '';
    },

    _getGridViewClasses(options): string {
        let classes = `controls-Grid controls-Grid_${options.style}_theme-${options.theme}`;
        if (GridLadderUtil.isSupportLadder(options.ladderProperties)) {
            classes += ' controls-Grid_support-ladder';
        }
        if (options.columnScroll) {
            classes += ` ${COLUMN_SCROLL_JS_SELECTORS.CONTENT}`;
            // classes.add(DRAG_SCROLL_JS_SELECTORS.CONTENT, this._isDragScrollingVisible(options));
        }
        return classes;
    },

    _getGridViewStyles(options): string {
        const hasMultiSelectColumn = options.multiSelectVisibility !== 'hidden' && options.multiSelectPosition !== 'custom';
        return this._getGridTemplateColumns(options.columns, hasMultiSelectColumn);
    },

    _onItemMouseMove(event, collectionItem) {
        GridView.superclass._onItemMouseMove.apply(this, arguments);
        this._setHoveredCell(collectionItem.item, event.nativeEvent);
    },

    _onItemMouseLeave() {
        GridView.superclass._onItemMouseLeave.apply(this, arguments);
        this._setHoveredCell(null, null);
    },

    _onEditArrowClick(event: SyntheticEvent, row: GridRow<Model>): void {
        this._notify('editArrowClick', [row.getContents()]);
        event.stopPropagation();
    },

    _getCellIndexByEventTarget(event): number {
        if (!event) {
            return null;
        }
        const target = this._getCorrectElement(event.target);

        const gridRow = target.closest('.controls-Grid__row');
        if (!gridRow) {
            return null;
        }
        const gridCells = gridRow.querySelectorAll('.controls-Grid__row-cell');
        const currentCell = this._getCellByEventTarget(target);
        const multiSelectOffset = this._options.multiSelectVisibility !== 'hidden' ? 1 : 0;
        return Array.prototype.slice.call(gridCells).indexOf(currentCell) - multiSelectOffset;
    },

    _getCorrectElement(element: HTMLElement): HTMLElement {
        // В FF целью события может быть элемент #text, у которого нет метода closest, в этом случае рассматриваем как
        // цель его родителя.
        if (element && !element.closest && element.parentElement) {
            return element.parentElement;
        }
        return element;
    },
    _getCellByEventTarget(target: HTMLElement): HTMLElement {
        return target.closest('.controls-Grid__row-cell') as HTMLElement;
    },

    _setHoveredCell(item, nativeEvent): void {
        const hoveredCellIndex = this._getCellIndexByEventTarget(nativeEvent);
        if (item !== this._hoveredCellItem || hoveredCellIndex !== this._hoveredCellIndex) {
            this._hoveredCellItem = item;
            this._hoveredCellIndex = hoveredCellIndex;
            let container = null;
            let hoveredCellContainer = null;
            if (nativeEvent) {
                const target = this._getCorrectElement(nativeEvent.target);
                container = target.closest('.controls-ListView__itemV');
                hoveredCellContainer = this._getCellByEventTarget(target);
            }
            this._notify('hoveredCellChanged', [item, container, hoveredCellIndex, hoveredCellContainer]);
        }
    },

    // todo Переписать, сделать аналогично Footer/Header/Results
    _prepareColumnsForEmptyEditingTemplate(columns, topSpacing, bottomSpacing) {
        return prepareEmptyEditingColumns({
            gridColumns: this._options.columns,
            emptyTemplateSpacing: {
                top: topSpacing,
                bottom: bottomSpacing
            },
            isFullGridSupport: this._options.isFullGridSupport,
            hasMultiSelect: this._options.multiSelectVisibility !== 'hidden' && this._options.multiSelectPosition === 'default',
            colspanColumns: columns,
            itemPadding: this._options.itemPadding || {},
            theme: this._options.theme,
            editingBackgroundStyle: (this._options.editingConfig ? this._options.editingConfig.backgroundStyle : 'default')
        });
    },

    _prepareColumnsForEmptyTemplate(columns, content, topSpacing, bottomSpacing, theme) {
        const ladderStickyColumn = GridLadderUtil.getStickyColumn({
            columns: this._options.columns
        });
        let gridColumns;
        if (ladderStickyColumn) {
            gridColumns = (ladderStickyColumn.property.length === 2 ? [{}, {}] : [{}]).concat(this._options.columns);
        } else {
            gridColumns = this._options.columns;
        }

        return prepareEmptyColumns({
            gridColumns,
            emptyTemplateSpacing: {
                top: topSpacing,
                bottom: bottomSpacing
            },
            isFullGridSupport: this._options.isFullGridSupport,
            hasMultiSelect: this._options.multiSelectVisibility !== 'hidden' && this._options.multiSelectPosition === 'default',
            colspanColumns: content ? [{template: content}] : columns,
            itemPadding: this._options.itemPadding || {},
            theme: this._options.theme,
            afterPrepareCallback(column, index, columns): void {
                column.classes = 'controls-ListView__empty ' +
                    'controls-ListView__empty_theme-default ' +
                    `controls-ListView__empty_topSpacing_${topSpacing}_theme-${theme} ` +
                    `controls-ListView__empty_bottomSpacing_${bottomSpacing}_theme-${theme}`;
            }
        });
    },

    //#region COLUMN SCROLL
    /**
     * Создает или удаляет контроллер горизонтального скролла в зависимости от того, нужен ли он списку
     *  should be called in the end of life cycle
     */
    _actualizeColumnScroll(options, isOnMount?: boolean): 'created' | 'actual' | 'destroyed' {
        let result: 'created' | 'actual' | 'destroyed';

        if (options.columnScroll) {
            const scrollContainer = this._children.gridWrapper;
            const contentContainer = this._children.grid;
            const needBySize = ColumnScroll.shouldDrawColumnScroll(scrollContainer, contentContainer, options.isFullGridSupport);

            if (needBySize) {
                if (!this._columnScrollController) {
                    this._createColumnScroll(options);
                    this._columnScrollController.updateSizes((newSizes) => {
                        if (isOnMount && this._options.columnScrollStartPosition === 'end') {
                            this._columnScrollController.setScrollPosition(newSizes.contentSize - newSizes.containerSize);
                        }
                        this._saveColumnScrollSizes(newSizes);
                        this._updateColumnScrollData();
                    }, true);
                    result = 'created';
                } else {
                    result = 'actual';
                }
            } else {
                this._destroyColumnScroll();
                result = 'destroyed';
            }
        } else {
            this._destroyColumnScroll();
            result = 'destroyed';
        }

        return result;
    },
    _createColumnScroll(options): void {
        this._columnScrollController = new ColumnScroll({
            isFullGridSupport: options.isFullGridSupport,
            needBottomPadding: options._needBottomPadding,
            stickyColumnsCount: options.stickyColumnsCount,
            hasMultiSelect: options.multiSelectVisibility !== 'hidden' && options.multiSelectPosition === 'default',
            theme: options.theme,
            backgroundStyle: options.backgroundStyle,
            isEmptyTemplateShown: options.needShowEmptyTemplate
        });
        const uniqueSelector = this._columnScrollController.getTransformSelector();
        this._columnScrollContainerClasses = `${COLUMN_SCROLL_JS_SELECTORS.CONTAINER} ${uniqueSelector}`;
        this._columnScrollShadowClasses = { start: '', end: '' };

        if (this._isDragScrollingEnabled(options) && !this._dragScrollController) {
            // _private.initDragScroll(self, options);
        }

        this._columnScrollController.setContainers({
            scrollContainer: this._children.gridWrapper,
            contentContainer: this._children.grid,
            stylesContainer: this._children.columnScrollStylesContainer
        });
    },

    _destroyColumnScroll(): void {
        if (this._columnScrollController) {
            this._columnScrollController.destroy();
            this._columnScrollController = null;
            this._columnScrollContainerClasses = COLUMN_SCROLL_JS_SELECTORS.CONTAINER;
            this._columnScrollShadowClasses = null;
            this._destroyDragScroll();
        }
    },

    _destroyDragScroll(): void {
        if (this._dragScrollController) {
            this._dragScrollController.destroy();
            this._dragScrollController = null;
            this._dragScrollOverlayClasses = '';
        }
    },

    isColumnScrollVisible(): boolean {
        return this._columnScrollController && this._columnScrollController.isVisible() && (
            !!this._listModel.getCount() ||
            this._listModel.isEditing() ||
            this._options.headerVisibility === 'visible' ||
            this._options.headerInEmptyListVisible === true
        );
    },
    _saveColumnScrollSizes(newSizes): void {
        this._contentSizeForHScroll = newSizes.contentSizeForScrollBar;
        this._horizontalScrollWidth = newSizes.scrollWidth;
        this._containerSize = newSizes.containerSize;
        this._fixedColumnsWidth = newSizes.fixedColumnsWidth;
        this._scrollableColumnsWidth = newSizes.scrollableColumnsWidth;
    },
    _updateColumnScrollData(): void {
        this._updateColumnScrollShadowClasses();
        this._setHorizontalScrollPosition(this._columnScrollController.getScrollPosition());
        this._dragScrollController?.updateScrollData({
            scrollLength: this._columnScrollController.getScrollLength(),
            scrollPosition: this._horizontalScrollPosition
        });
    },
    _updateColumnScrollShadowClasses(options = this._options): void {
        const start = this._getColumnScrollShadowClasses(options, 'start');
        const end = this._getColumnScrollShadowClasses(options, 'end');

        if (!this._columnScrollShadowClasses) {
            this._columnScrollShadowClasses = {};
        }
        if (this._columnScrollShadowClasses.start !== start || this._columnScrollShadowClasses.end !== end) {
            this._columnScrollShadowClasses = { start, end };
        }
    },
    _getColumnScrollShadowClasses(options, position: 'start' | 'end'): string {
        return this._columnScrollController.getShadowClasses(position);
    },
    _setHorizontalScrollPosition(value: number): void {
        if (this._horizontalScrollPosition !== value) {
            this._horizontalScrollPosition = value;
        }
        this._children.horizontalScrollThumb?.setPosition(value);
    },
    _onGridWrapperWheel(e) {
        if (this.isColumnScrollVisible()) {
            this._columnScrollController.scrollByWheel(e);
            this._setHorizontalScrollPosition(this._columnScrollController.getScrollPosition());
            this._updateColumnScrollData();
        }
    },
    _horizontalPositionChangedHandler(e, newScrollPosition: number): void {
        this._columnScrollController.setScrollPosition(newScrollPosition);
        this._setHorizontalScrollPosition(this._columnScrollController.getScrollPosition());
        this._updateColumnScrollData();
    },
    _getThumbStyles(): string {
        if (!this.isColumnScrollVisible()) {
            return 'display: none;';
        }

        let offset = 0;
        let lastCellOffset = 0;

        // Учёт колонки с чекбоксами для выбора записей
        if (this._listModel.needMultiSelectColumn()) {
            offset += 1;
        }

        // Учёт колонки(или колонок) с лесенкой
        offset += GridLadderUtil.stickyLadderCellsCount(
            this._options.columns,
            this._options.stickyColumn,
            this._listModel.getDraggingItem()
        );

        // if (listModel._shouldAddActionsCell()) {
        //     lastCellOffset++;
        // }
        const stickyColumnsCount = this._listModel.getStickyColumnsCount();
        const columns = this._listModel.getColumnsConfig();

        return `grid-column: ${stickyColumnsCount + 1 + offset} / ${(columns.length + lastCellOffset + 1) + offset};`
             + ` width: ${this._horizontalScrollWidth}px;`;
    },
    //#endregion

    _isDragScrollingEnabled(options): boolean {
        const hasOption = typeof options.dragScrolling === 'boolean';
        return hasOption ? options.dragScrolling : !options.itemsDragNDrop;
    },

    _resizeHandler(): void {
        if (this._options.columnScroll) {
            if (this._actualizeColumnScroll(this._options) === 'actual') {
                this._columnScrollController.updateSizes((newSizes) => {
                    this._saveColumnScrollSizes(newSizes);
                    this._updateColumnScrollData();
                });
            }
        }
    }
});

GridView._theme = ['Controls/grid', 'Controls/Classes'];

GridView.contextTypes = () => {
    return {
        isTouch
    };
};

export default GridView;
