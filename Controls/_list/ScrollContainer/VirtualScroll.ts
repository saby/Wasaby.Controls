import {
    IRange,
    IContainerHeights,
    IDirection,
    IItemsHeights,
    IVirtualScrollOptions, IPlaceholders,
    IRangeShiftResult
} from './interfaces';

export default class VirtualScroll {
    private _containerHeightsData: IContainerHeights = {scroll: 0, trigger: 0, viewport: 0};
    private _options: IVirtualScrollOptions;
    private _itemsHeightData: IItemsHeights = {itemsHeights: [], itemsOffsets: []};
    private _range: IRange = {start: 0, stop: 0};
    private _oldRange: IRange = {start: 0, stop: 0};
    private _savedDirection: IDirection;
    private _savedScrollIndex: number;
    private _itemsCount: number;

    rangeChanged: boolean;

    readonly get isNeedToRestorePosition(): boolean {
        return Boolean(this._savedDirection || this._savedScrollIndex);
    }

    constructor(
        options: Partial<IVirtualScrollOptions>,
        containerData: Partial<IContainerHeights>
    ) {
        this.setOptions(options);
        this.applyContainerHeightsData(containerData);
    }

    setOptions(options: Partial<IVirtualScrollOptions>): void {
        const pageSize = options.pageSize;
        let segmentSize: number = options.segmentSize;

        if (!segmentSize) {
            segmentSize = Math.ceil(pageSize / 4);
        }

        this._options = {...this._options, ...{segmentSize, pageSize}};
    }

    applyContainerHeightsData(containerData: Partial<IContainerHeights>): void {
        this._containerHeightsData = {...this._containerHeightsData, ...containerData};
    }

    updateItemsCount(count: number): void {
        this._itemsCount = count;
    }

    /**
     * Создает новый диапазон видимых индексов
     * @remark Используется при инициализации
     * @param startIndex Начальный индекс создаваемого диапазона
     * @param itemsCount Общее количество элементов
     * @param itemsHeights Высоты элементов
     */
    resetRange(startIndex: number, itemsCount: number, itemsHeights?: Partial<IItemsHeights>): IRangeShiftResult {
        this._savedScrollIndex = startIndex;
        this.updateItemsCount(itemsCount);

        if (itemsHeights) {
            this._itemsHeightData = {...this._itemsHeightData, ...itemsHeights};

            return this._createRangeByItemHeightProperty(startIndex, itemsCount);
        } else {
            return this._createRangeByIndex(startIndex, itemsCount);
        }
    }

    /**
     * Рассчет видимых индексов от позиции скролла
     * @remark
     * Вызывается при смещении скролла за счет движения скроллбара
     */
    shiftRangeToScrollPosition(virtualScrollPosition: number): IRangeShiftResult {
        const itemsHeights = this._itemsHeightData.itemsHeights;
        const pageSize = this._options.pageSize;
        const itemsCount = this._itemsCount;
        const triggerHeight = this._containerHeightsData.trigger;

        let start = 0, stop;
        let tempPlaceholderSize = 0;

        while (tempPlaceholderSize + itemsHeights[start] <= virtualScrollPosition - triggerHeight) {
            tempPlaceholderSize += itemsHeights[start];
            start++;
        }

        start = Math.max(start - (Math.trunc(pageSize / 2)), 0);
        stop = Math.min(start + pageSize, itemsCount);

        // Если мы скроллим быстро к концу списка, startIndex может вычислиться такой,
        // что число отрисовываемых записей будет меньше virtualPageSize (например если
        // в списке из 100 записей по scrollTop вычисляется startIndex == 95, то stopIndex
        // будет равен 100 при любом virtualPageSize >= 5.
        // Нам нужно всегда рендерить virtualPageSize записей, если это возможно, т. е. когда
        // в коллекции достаточно записей. Поэтому если мы находимся в конце списка, пробуем
        // отодвинуть startIndex назад так, чтобы отрисовывалось нужное число записей.
        if (stop === itemsCount) {
            const missingCount = pageSize - (stop - start);
            if (missingCount > 0) {
                start = Math.max(start - missingCount, 0);
            }
        }

        return this._setRange({start, stop});
    }

    /**
     * Производит смещение диапазона за счет добавления новых элементов
     * @param addIndex индекс начиная с которого происходит вставка элементов
     * @param count количество вставляемых элементов
     */
    insertItems(addIndex: number, count: number): IRangeShiftResult {
        const direction = addIndex <= this._range.start ? 'up' : 'down';
        this._insertItemHeights(addIndex, count);

        if (direction === 'up') {
            this._updateStartIndex(this._range.start + count, this._itemsHeightData.itemsHeights.length);
        }

        return this._setRange(this._shiftRangeBySegment(direction, count));
    }

    /**
     * Производит смещение диапазона за счет удаления элементов
     * @param removeIndex индекс начиная с которого происходит удаление элементов
     * @param count количество удаляемых элементов
     */
    removeItems(removeIndex: number, count: number): IRangeShiftResult {
        const direction = removeIndex < this._range.start ? 'up' : 'down';
        this._removeItemHeights(removeIndex, count);

        return this._setRange(this._shiftRangeBySegment(direction, count));
    }

    /**
     * Производит смещение диапазона по направлению на segmentSize
     * @param direction
     */
    shiftRange(direction: IDirection): IRangeShiftResult {
        this._oldRange = this._range;
        this._savedDirection = direction;
        const itemsHeightsData = this._itemsHeightData;
        const itemsCount = this._itemsCount;
        const segmentSize = this._options.segmentSize;
        let {start, stop} = this._range;

        if (segmentSize) {
            const quantity = this._getItemsToHideQuantity(direction);

            if (direction === 'up') {
                start = Math.max(0, start - segmentSize);
                stop -= quantity;
            } else {
                stop = Math.min(stop + segmentSize, itemsCount);
                start += quantity;
            }
        } else {
            start = 0;
            stop = itemsCount;
        }

        return this._setRange({start, stop});
    }

    /**
     * Запоминает данные из ресайза вьюпорта на инстанс
     * @param viewportHeight
     * @param triggerHeight
     * @param itemsContainer
     */
    resizeViewport(viewportHeight: number, triggerHeight: number, itemsContainer: HTMLElement): void {
        this.applyContainerHeightsData({viewport: viewportHeight, trigger: triggerHeight});
        this._updateItemsHeights(itemsContainer);
    }

    /**
     * Запоминает данные из ресайза вью на инстанс
     * @param viewHeight
     * @param triggerHeight
     * @param itemsContainer
     */
    resizeView(viewHeight: number, triggerHeight: number, itemsContainer: HTMLElement): void {
        this.applyContainerHeightsData({scroll: viewHeight, trigger: triggerHeight});
        this._updateItemsHeights(itemsContainer);
    }

    /**
     * Обновляет данные об элементах
     * @param container
     */
    updateItemsHeights(container: HTMLElement): void {
        this._updateItemsHeights(container);
        this.rangeChanged = false;
    }

    /**
     * Возвращает восстановленную позицию скролла по направлению
     * @param scrollTop
     */
    getPositionToRestore(scrollTop: number): number {
        const itemsOffsets = this._itemsHeightData.itemsOffsets;
        const itemsHeights = this._itemsHeightData.itemsHeights;
        let savedPosition: number;

        if (this._savedDirection) {
            savedPosition = this._savedDirection === 'up' ?
                scrollTop + this._getItemsHeightsSum(this._range.start, this._oldRange.start, itemsHeights) :
                scrollTop - this._getItemsHeightsSum(this._oldRange.start, this._range.start, itemsHeights);
        } else if (this._savedScrollIndex) {
            savedPosition = itemsOffsets[this._savedScrollIndex];
        }

        this._savedDirection = this._savedScrollIndex = null;

        return savedPosition;
    }

    getItemOffset(index: number): number {
        return this._itemsHeightData.itemsOffsets[index];
    }

    /**
     * Проверяет что виртуальное окно находится на переданном краю
     * @param edge
     */
    isRangeOnEdge(edge: IDirection): boolean {
        return edge === 'up' ? this._range.start === 0 : this._range.stop === this._itemsCount;
    }

    /**
     * Проверяет возможность подскроллить к верхней границе элемента
     * @param itemIndex
     */
    canScrollToItem(itemIndex: number): boolean {
        let canScroll = false;
        const {viewport, scroll: scrollHeight} = this._containerHeightsData;
        const itemOffset = this._itemsHeightData.itemsOffsets[itemIndex];

        if (this._range.stop === this._itemsCount) {
            canScroll = true;
        } else if (this._isItemInRange(itemIndex) &&
            viewport < scrollHeight - itemOffset) {
            canScroll = true;
        }

        return canScroll;
    }

    /**
     * Возвращает индекс активного элемента
     * @param scrollTop
     */
    getActiveElementIndex(scrollTop: number): number {
        const {viewport, scroll} = this._containerHeightsData;
        if (!this._itemsCount) {
            return undefined;
        } else if (this.isRangeOnEdge('up') && scrollTop === 0) {
            return this._range.stop - 1;
        } else if (this.isRangeOnEdge('down') && scrollTop + viewport === scroll) {
            return this._range.start;
        } else {
            let itemIndex;
            const {itemsOffsets} = this._itemsHeightData;
            const viewportCenter = scrollTop + viewport / 2;

            for (let i = this._range.start ; i < this._range.stop; i++) {
                if (itemsOffsets[i] < viewportCenter) {
                    itemIndex = i;
                } else {
                    break;
                }
            }

            return itemIndex;
        }
    }

    /**
     * Проверяет наличие элемента в диапазоне по его индексу
     * @param itemIndex
     */
    private _isItemInRange(itemIndex: number): boolean {
        return this._range.start <= itemIndex && this._range.stop > itemIndex;
    }

    private _getPlaceholders(): IPlaceholders {
        return {
            top: this._getItemsHeightsSum(
                0,
                this._range.start,
                this._itemsHeightData.itemsHeights
            ),
            bottom: this._getItemsHeightsSum(
                this._range.stop,
                this._itemsHeightData.itemsHeights.length,
                this._itemsHeightData.itemsHeights
            )
        };
    }

    private _updateItemsHeights(container: HTMLElement): void {
        let sum = 0;
        let startChildrenIndex = 0;

        for (let i = startChildrenIndex, len = container.children.length; i < len; i++) {
            if (container.children[i].className.indexOf('controls-ListView__hiddenContainer') === -1) {
                startChildrenIndex = i;
                break;
            }
        }

        for (let i = 0; i < this._range.stop - this._range.start; i++) {
            const itemHeight = container.children[startChildrenIndex + i].getBoundingClientRect().height;

            this._itemsHeightData.itemsHeights[this._range.start + i] = itemHeight;
            this._itemsHeightData.itemsOffsets[this._range.start + i] = sum;
            sum += itemHeight;
        }
    }

    /**
     * Расчет видимых индексов от заранее высчитанных высот
     * @remark
     * Используется для оптимизаций частных случаев, когда построить один лишний элемент будет очень дорого,
     * например если один элемент это огромный пункт с кучей контролов внутри)
     * @param startIndex Начальный индекс
     * @param itemsCount Количество элементов
     */
    private _createRangeByItemHeightProperty(startIndex: number, itemsCount: number): IRangeShiftResult {
        const itemsHeights = this._itemsHeightData.itemsHeights;
        const viewportHeight = this._containerHeightsData.viewport;

        let sumHeight = 0;
        let stop: number;
        let start: number = startIndex;

        for (let i = start; i < itemsCount; i++) {
            const itemHeight = itemsHeights[i];
            if (sumHeight + itemHeight <= viewportHeight) {
                sumHeight += itemHeight;
            } else {
                stop = i;
                break;
            }
        }

        if (stop === itemsCount - 1) {
            sumHeight = 0;

            for (let i = itemsCount - 1; i > 0; i--) {
                const itemHeight = itemsHeights[i];

                if (sumHeight + itemHeight <= viewportHeight) {
                    sumHeight += itemHeight;
                } else {
                    start = i;
                    break;
                }
            }
        }

        /**
         * @remark Так как списки итерируются пока i < stopIndex, то нужно добавить 1
         * @example items: [{height: 20, ...}, {height: 40, ...}, {height: 50, ...}], itemHeightProperty: 'height'
         * viewportHeight: 70
         * Если бы мы не добавили единицу, то получили бы startIndex = 0 и stopIndex = 2, но так как итерируюется
         * пока i < stopIndex, то мы получим не три отрисованных элемента, а 2
         */
        return this._setRange({start, stop: stop + 1});
    }

    /**
     * Расчет видимых индексов от переданного индекса
     * @remark
     * Вызывается при инциализации виртуального скролла от переданного индекса
     * @param startIndex
     * @param itemsCount
     */
    private _createRangeByIndex(startIndex: number, itemsCount: number): IRangeShiftResult {
        const pageSize = this._options.pageSize;
        let start;
        let stop;

        if (pageSize < itemsCount || !pageSize) {
            start = startIndex;
            stop = start + pageSize;

            if (stop >= itemsCount) {
                stop = itemsCount;
                start = stop - pageSize;
            }
        } else {
            start = 0;
            stop = itemsCount;
        }

        return this._setRange({start, stop});
    }

    private _updateStartIndex(index: number, itemsCount: number): void {
        const start = Math.max(0, index);
        const stop = Math.min(itemsCount, this._range.start + this._options.pageSize);
        this._range.start = Math.max(0, index);
        this._range.stop = Math.min(itemsCount, this._range.start + this._options.pageSize);
    }

    private _insertItemHeights(insertIndex: number, length: number): void {
        const topItemsHeight = this._itemsHeightData.itemsHeights.slice(0, insertIndex + 1);
        const insertedItemsHeights = [];
        const bottomItemsHeight = this._itemsHeightData.itemsHeights.slice(insertIndex + 1);

        for (let i = 0; i < length; i++) {
            insertedItemsHeights[i] = 0;
        }

        this._itemsHeightData = {
            ...this._itemsHeightData,
            itemsHeights: topItemsHeight.concat(insertedItemsHeights, bottomItemsHeight)
        };
    }

    private _removeItemHeights(removeIndex: number, length: number): void {
        this._itemsHeightData.itemsHeights = this._itemsHeightData.itemsHeights.splice(removeIndex + 1, length);
    }

    private _shiftRangeBySegment(direction: IDirection, segmentSize: number): IRange {
        const itemsCount = this._itemsCount;
        const fixedSegmentSize = Math
            .min(
                this._options.pageSize - (this._range.stop - this._range.start),
                segmentSize,
                0);
        let {start, stop} = this._range;

        if (direction === 'up') {
            start = Math.max(0, start - fixedSegmentSize);
        } else {
            stop = Math.min(Math.max(start + fixedSegmentSize, stop), itemsCount);
        }

        return {
            start, stop
        };
    }

    /**
     * Рассчитывает сколько элементов нужно скрыть
     * @remark Оставляем элементов с запасом на 2 вьюпорта для плавного скроллинга
     */
    private _getItemsToHideQuantity(direction: string): number {
        if (direction === 'up') {
            return this._getItemsToHideQuantityToUp();
        } else {
            return this._getItemsToHideQuantityToDown();
        }
    }

    /**
     * Рассчитывает сколько элементов нужно скрыть сверху
     */
    private _getItemsToHideQuantityToUp(): number {
        let quantity = 0;
        let stop = this._range.stop - 1;
        const {viewport, trigger} = this._containerHeightsData;
        const {itemsOffsets} = this._itemsHeightData;
        const offsetDistance = viewport * 2 + trigger;

        while (itemsOffsets[stop] > offsetDistance) {
            stop--;
            quantity++;
        }

        return quantity;
    }

    /**
     * Рассчитывает сколько элементов нужно скрыть сверху
     */
    private _getItemsToHideQuantityToDown(): number {
        let quantity = 0;
        let start = this._range.start;
        let sumHeight = 0;
        const {viewport, trigger, scroll} = this._containerHeightsData;
        const {itemsHeights} = this._itemsHeightData;
        const offsetDistance = (scroll - viewport) - trigger - viewport;

        while (sumHeight + itemsHeights[start] < offsetDistance) {
            sumHeight += itemsHeights[start];
            quantity++;
            start++;
        }

        return quantity;
    }

    private _setRange(range: IRange): IRangeShiftResult {
        if (range.start !== this._range.start || range.stop !== this._range.stop) {
            this._range = range;
            this.rangeChanged = true;
        }

        return {
            range: this._range,
            placeholders: this._getPlaceholders()
        };
    }

    private _getItemsHeightsSum(startIndex: number, stopIndex: number, itemsHeights: number[]): number {
        let sum = 0;

        for (let i = startIndex; i < stopIndex; i++) {
            sum += itemsHeights[i];
        }

        return sum;
    }
}
