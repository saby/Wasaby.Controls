import { ListView } from 'Controls/list';
import { TemplateFunction } from 'UI/Base';
import { TouchContextField as isTouch } from 'Controls/context';
import { Logger} from 'UI/Utils';
import { GridRow, GridLadderUtil, GridLayoutUtil, isFullGridSupport } from 'Controls/display';
import * as GridTemplate from 'wml!Controls/_gridNew/Render/grid/GridView';
import * as GridItem from 'wml!Controls/_gridNew/Render/grid/Item';
import * as GroupTemplate from 'wml!Controls/_gridNew/Render/GroupTemplate';
import { prepareEmptyEditingColumns, prepareEmptyColumns } from 'Controls/Utils/GridEmptyTemplateUtil';
import * as GridIsEqualUtil from 'Controls/Utils/GridIsEqualUtil';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    ColumnScrollController as ColumnScroll,
    DragScrollController as DragScroll,
    COLUMN_SCROLL_JS_SELECTORS,
    DRAG_SCROLL_JS_SELECTORS,
    isInLeftSwipeRange
} from 'Controls/columnScroll';

const GridView = ListView.extend({
    _template: GridTemplate,
    _hoveredCellIndex: null,
    _hoveredCellItem: null,
    _groupTemplate: GroupTemplate,
    _isFullMounted: false,
    _columnScrollController: null,
    _dragScrollController: null,
    _columnScrollContainerClasses: '',
    _columnScrollShadowClasses: '',
    _dragScrollOverlayClasses: '',
    _viewGrabbingClasses: '',

    _beforeMount(options): void {
        let result = GridView.superclass._beforeMount.apply(this, arguments);
        this._prepareColumnsForEmptyEditingTemplate = this._prepareColumnsForEmptyEditingTemplate.bind(this);
        this._prepareColumnsForEmptyTemplate = this._prepareColumnsForEmptyTemplate.bind(this);
        this._horizontalPositionChangedHandler = this._horizontalPositionChangedHandler.bind(this);


        if (options.columnScroll && options.columnScrollStartPosition === 'end' && options.isFullGridSupport) {
            // В таблице с горизонтальным скроллом изначально прокрученным в конец используется фейковая таблица.
            // Т.к. для отрисовки горизонтального скролла требуется знать размеры таблицы, инициализация горизонтального скролла
            // происходит на afterMount, который не вызывается на сервере. Чтобы измежать скачка, при оживлении таблицы с
            // прокрученными в конец колонками, на сервере строится фейковая таблица, состаящая из двух гридов.
            // Первый - фиксированные колонки, абсолютный блок, прижат к левому краю релативной обертки.
            // Второй - все остальные колонки, абсолютный блок, прижат к правому краю релативной обертки.
            // При построении настоящая таблица скрывается с помощью visibility и строится в обыччном порядке.
            // Затем проскроливается вконец и только после этого заменяет фейковую.
            // preventServerSideColumnScroll - запрещает построение с помощью данного механизма. Нужно например при поиске, когда
            // таблица перемонтируется. Простая проверка на window нам не подходит, т.к. нас интересует только первая отрисовка view
            // списочного контрола.
            this._showFakeGridWithColumnScroll = !options.preventServerSideColumnScroll;
        }

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

        // Создание или разрушение контроллеров горизонтального скролла и скроллирования мышкой при изменении опций
        // columnScroll и dragScroll.
        this._updateColumnScroll(this._options, newOptions);
    },

    _afterUpdate(oldOptions): void {
        GridView.superclass._afterUpdate.apply(this, arguments);

        if (this._options.columnScroll) {
            // Обновление горизонтального скролла при изменении опций, которые косвенно влияют на горизонтальный скролл(опции,
            // которые приведут к визуальному изменению списка), например, видимость множественного выбора, кол-во
            // зафиксированных колонок и т.п.
            this._updateColumnScrollBySideOptions(oldOptions, this._options);
        }
    },

    _beforeUnmount(): void {
        GridView.superclass._beforeUnmount.apply(this, arguments);
        this._destroyColumnScroll();
    },

    _resolveItemTemplate(options): TemplateFunction {
        return options.itemTemplate || this._resolveBaseItemTemplate(options);
    },

    _resolveBaseItemTemplate(options): TemplateFunction {
        return GridItem;
    },

    _getGridTemplateColumns(options): string {
        const hasMultiSelect = options.multiSelectVisibility !== 'hidden' && options.multiSelectPosition !== 'custom';

        if (!options.columns) {
            Logger.warn('You must set "columns" option to make grid work correctly!', this);
            return '';
        }
        const initialWidths = options.columns.map(((column) => column.width || GridLayoutUtil.getDefaultColumnWidth()));
        let columnsWidths: string[] = [];
        columnsWidths = initialWidths;
        const ladderStickyColumn = GridLadderUtil.getStickyColumn({
            columns: options.columns
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

        if (options.isFullGridSupport && !!options.columnScroll && options.itemActionsPosition !== 'custom') {
            columnsWidths.push('0px');
        }

        return GridLayoutUtil.getTemplateColumnsStyle(columnsWidths);
    },

    _getGridViewWrapperClasses(): string {
        return `${this._columnScrollContainerClasses} ${this.isColumnScrollVisible() ? COLUMN_SCROLL_JS_SELECTORS.COLUMN_SCROLL_VISIBLE : ''}`
    },

    _getGridViewClasses(options): string {
        let classes = `controls-Grid controls-Grid_${options.style}_theme-${options.theme}`;
        if (GridLadderUtil.isSupportLadder(options.ladderProperties)) {
            classes += ' controls-Grid_support-ladder';
        }
        if (options.columnScroll) {
            classes += ` ${COLUMN_SCROLL_JS_SELECTORS.CONTENT}`;
            if (this._isDragScrollingEnabled(options)) {
                classes += ` ${DRAG_SCROLL_JS_SELECTORS.CONTENT} ${this._viewGrabbingClasses}`;
            }
        }
        return classes;
    },

    _getGridViewStyles(options): string {
        return this._getGridTemplateColumns(options);
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

    _onWrapperMouseEnter: function() {
        // При загрузке таблицы с проскроленным в конец горизонтальным скролом следует оживить таблицу при
        // вводе в нее указателя мыши, но после отрисовки thumb'а (скрыт через visibility) во избежание скачков
        if (this._showFakeGridWithColumnScroll) {
            this._showFakeGridWithColumnScroll = false;
        }
    },

    _onMouseDown(e) {
        this._startDragScrolling(e, 'mouse');
    },

    _onTouchStart(e) {
        this._startDragScrolling(e, 'touch');
    },

    _onMouseMove(e) {
        this._moveDragScroll(e, 'mouse');
    },

    _onTouchMove(e) {
        this._moveDragScroll(e, 'touch');
    },

    _onMouseUp(e) {
        this._stopDragScrolling(e, 'mouse');
    },

    _onTouchEnd(e) {
        this._stopDragScrolling(e, 'touch');
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
            this._initDragScroll(options);
        }

        this._columnScrollController.setContainers({
            scrollContainer: this._children.gridWrapper,
            contentContainer: this._children.grid,
            stylesContainer: this._children.columnScrollStylesContainer
        });
    },

    _updateColumnScrollBySideOptions(oldOptions, newOptions): void {
        const columnScrollStatus = this._actualizeColumnScroll(newOptions);
        if (columnScrollStatus === 'destroyed') {
            return;
        }

        const stickyColumnsCountChanged = newOptions.stickyColumnsCount !== oldOptions.stickyColumnsCount;
        const multiSelectVisibilityChanged = newOptions.multiSelectVisibility !== oldOptions.multiSelectVisibility;
        const dragScrollingChanged = newOptions.dragScrolling !== oldOptions.dragScrolling;
        const columnsChanged = !GridIsEqualUtil.isEqualWithSkip(oldOptions.columns, newOptions.columns,
            { template: true, resultTemplate: true });
        let columnScrollChanged = false;

        if (
            columnScrollChanged ||
            stickyColumnsCountChanged ||
            multiSelectVisibilityChanged ||
            columnsChanged
        ) {

            // Если горизонтльный скролл был только что создан, то он хранит актуальные размеры.
            if (columnScrollStatus !== 'created') {

                // Смена колонок может не вызвать событие resize на обёртке грида(ColumnScroll), если общая ширина колонок до обновления и после одинакова.
                this._columnScrollController.updateSizes((newSizes) => {
                    this._saveColumnScrollSizes(newSizes);
                    this._updateColumnScrollData();
                }, true);
            }
        } else if (dragScrollingChanged && newOptions.dragScrolling) {
            // При включении перетаскивания не нужно ничего перерисовывать. Нужно просто отдать контроллеру перетаскивания размеры.
            // Сделать при инициализации это нельзя, т.к. контроллеры drag и scroll создаются на разных хуках (before и after update соотв.)
            // Создание dragScroll на afterUpdate вынудит делать _forceUpdate для обновления состояний (курсор над записями).
            // Создание columnScroll на beforeUpdate невозможно, т.к. контроллер создается только по мере необходимости.
            this._updateColumnScrollData();
        }
    },

    _updateColumnScroll(oldOptions, newOptions): void {
        const isColumnScrollChanged = newOptions.columnScroll !== oldOptions.columnScroll;

        // Если горизонтального скролла не было и нет либо он только появился - то ничего не делаем.
        // Создание произойдет после обновления, когда все размеры будут актуальны.
        if (isColumnScrollChanged && newOptions.columnScroll || !isColumnScrollChanged && !newOptions.columnScroll) {
            return;
        }

        // Выключение горизонтального скролла приводит к разрушению контроллера.
        // Попадаем сюда если опция columnScroll поменялась и стала false.
        if (!newOptions.columnScroll) {
            this._destroyColumnScroll();
            return;
        }

        // Включение/выключение перемещения мышкой приводит к созданию/разрушению контроллера.
        // Попадаем сюда, если опция columnScroll не поменялась и равна true.
        if (oldOptions.dragScrolling !== newOptions.dragScrolling) {
            if (newOptions.dragScrolling) {
                this._initDragScroll(newOptions);
            } else {
                this._destroyDragScroll();
            }
            return;
        }

        // При включении/выключении перемещения записей мышкой необходимо уведомить контроллер скроллирования перетаскиванием.
        // Попадаем сюда, если опции columnScroll и dragScrolling не поменялась и равны true.
        if (newOptions.dragScrolling && oldOptions.itemsDragNDrop !== newOptions.itemsDragNDrop) {
            this._dragScrollController.setStartDragNDropCallback(!newOptions.itemsDragNDrop ? null : () => {
                this._setGrabbing(false);
                newOptions.startDragNDropCallback();
            });
        }
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
        if (this._showFakeGridWithColumnScroll && options.columnScrollStartPosition === 'end') {
            let classes = '';
            if (options.multiSelectVisibility !== 'hidden' && options.multiSelectPosition !== 'custom') {
                classes += `controls-Grid__ColumnScroll__shadow_withMultiselect_theme-${options.theme} `;
            }
            return classes + ColumnScroll.getShadowClasses({
                position,
                isVisible: position === 'start',
                theme: options.theme,
                backgroundStyle: options.backgroundStyle,
                needBottomPadding: options.needBottomPadding
            });
        }
        return this._columnScrollController.getShadowClasses(position);
    },
    _getColumnScrollFakeShadowStyles(options, position: 'start' | 'end'): string {
        if (this._showFakeGridWithColumnScroll && options.columnScrollStartPosition === 'end') {
            if (position === 'end') {
                return '';
            }

            let offsetLeft = 0;

            for (let i = 0; i < options.columns.length && i < options.stickyColumnsCount; i++) {
                if (!(options.columns[i].width && options.columns[i].width.indexOf('px') !== -1)) {

                } else {
                    offsetLeft += Number.parseInt(options.columns[i].width);
                }
            }

            return `left: ${offsetLeft}px; z-index: 5;`
        }
        return '';
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
            this._scrollToColumn();
        }
    },
    _scrollToColumn(): void {
        this._columnScrollController.scrollToColumnWithinContainer(this._children.header || this._children.results);
        this._setHorizontalScrollPosition(this._columnScrollController.getScrollPosition());
        this._updateColumnScrollData();
    },
    _horizontalPositionChangedHandler(e, newScrollPosition: number): void {
        e.stopPropagation();
        this._columnScrollController.setScrollPosition(newScrollPosition);
        this._setHorizontalScrollPosition(this._columnScrollController.getScrollPosition());
        this._updateColumnScrollData();
    },
    _getHorizontalScrollBarStyles(): string {
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

        if (!!this._options.columns && this._options.itemActionsPosition !== 'custom') {
            lastCellOffset++;
        }

        const stickyColumnsCount = this._listModel.getStickyColumnsCount();
        const columns = this._listModel.getColumnsConfig();

        return `grid-column: ${stickyColumnsCount + 1 + offset} / ${(columns.length + lastCellOffset + 1) + offset};`
             + ` width: ${this._horizontalScrollWidth}px;`;
    },
    _onThumbMouseUp(e) {
        e.stopPropagation();
        this._scrollToColumn();
    },

    //#endregion

    _isDragScrollingEnabled(options): boolean {
        const hasOption = typeof options.dragScrolling === 'boolean';
        return hasOption ? options.dragScrolling : !options.itemsDragNDrop;
    },

    _initDragScroll(options, pure?: boolean): void {
        const startDragNDropCallback = !options.startDragNDropCallback ? null : () => {
            this._setGrabbing(false);
            options.startDragNDropCallback();
        };
        this._dragScrollController = new DragScroll({
            startDragNDropCallback,
            dragNDropDelay: options.dragNDropDelay,
            onOverlayShown: () => {
                this._dragScrollOverlayClasses = `${DRAG_SCROLL_JS_SELECTORS.OVERLAY} ${DRAG_SCROLL_JS_SELECTORS.OVERLAY_ACTIVATED}`;
            },
            onOverlayHide: () => {
                this._setGrabbing(false);
                this._dragScrollOverlayClasses = `${DRAG_SCROLL_JS_SELECTORS.OVERLAY} ${DRAG_SCROLL_JS_SELECTORS.OVERLAY_DEACTIVATED}`;
            }
        });
        this._setGrabbing(false);
        this._dragScrollOverlayClasses = `${DRAG_SCROLL_JS_SELECTORS.OVERLAY} ${DRAG_SCROLL_JS_SELECTORS.OVERLAY_DEACTIVATED}`;
    },

    _setGrabbing(isGrabbing: boolean): void {
        if (this._isGrabbing !== isGrabbing) {
            this._isGrabbing = isGrabbing;
            this._viewGrabbingClasses = isGrabbing ? DRAG_SCROLL_JS_SELECTORS.CONTENT_GRABBING : '';
        }
    },

    _startDragScrolling(e, startBy: 'mouse' | 'touch'): void {
        if (this.isColumnScrollVisible() && this._dragScrollController) {
            let isGrabbing: boolean;
            if (startBy === 'mouse') {
                isGrabbing = this._dragScrollController.onViewMouseDown(e);
            } else {
                // clientX - координата относительно документа, чтобы получить координату
                // относиттельно начала списка, нужно учесть отступ самого списка
                const touchClientX = e.nativeEvent.touches[0].clientX;
                const containerLeft = this._children.columnScrollContainer.getBoundingClientRect().left;
                if (!isInLeftSwipeRange(this._fixedColumnsWidth, this._scrollableColumnsWidth, touchClientX - containerLeft)) {
                    isGrabbing = this._dragScrollController.onViewTouchStart(e);
                } else {
                    this._leftSwipeCanBeStarted = true;
                }
            }
            this._setGrabbing(isGrabbing);
        }
    },
    _moveDragScroll(e, startBy: 'mouse' | 'touch') {
        if (this.isColumnScrollVisible() && this._dragScrollController) {
            let newPosition: number;
            if (startBy === 'mouse') {
                newPosition = this._dragScrollController.onViewMouseMove(e);
            } else {
                newPosition = this._dragScrollController.onViewTouchMove(e);
            }
            if (newPosition !== null) {
                if (startBy === 'touch') {
                    this._notify('closeSwipe', []);
                }
                this._columnScrollController.setScrollPosition(newPosition);
                this._setHorizontalScrollPosition(this._columnScrollController.getScrollPosition());
                this._updateColumnScrollData();
            }
        }
    },
    _stopDragScrolling(e, startBy: 'mouse' | 'touch') {
        if (this.isColumnScrollVisible() && this._dragScrollController) {
            this._scrollToColumn();
            if (startBy === 'mouse') {
                this._dragScrollController.onViewMouseUp(e);
            } else {
                this._dragScrollController.onViewTouchEnd(e);
                this._leftSwipeCanBeStarted = false;
            }
            this._setGrabbing(false);
        }
    },
    _onDragScrollOverlayMouseMove(e): void {
        if (this.isColumnScrollVisible() && this._dragScrollController) {
            const newPosition = this._dragScrollController.onOverlayMouseMove(e);
            if (newPosition !== null) {
                this._columnScrollController.setScrollPosition(newPosition);
                this._updateColumnScrollData();
            }
        }
    },
    _onDragScrollOverlayTouchMove(e): void {
        if (this.isColumnScrollVisible() && this._dragScrollController) {
            const newPosition = this._dragScrollController.onOverlayTouchMove(e);
            if (newPosition !== null) {
                this._columnScrollController.setScrollPosition(newPosition);
                this._updateColumnScrollData();
            }
        }
    },
    _onDragScrollOverlayMouseUp(e) {
        this._scrollToColumn();
        this._dragScrollController?.onOverlayMouseUp(e);
    },
    _onDragScrollOverlayTouchEnd(e) {
        this._scrollToColumn();
        this._dragScrollController?.onOverlayTouchEnd(e);
    },
    _onDragScrollOverlayMouseLeave(e) {
        this._dragScrollController?.onOverlayMouseLeave(e);
    },
    _destroyDragScroll(): void {
        if (this._dragScrollController) {
            this._dragScrollController.destroy();
            this._dragScrollController = null;
            this._dragScrollOverlayClasses = '';
        }
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
