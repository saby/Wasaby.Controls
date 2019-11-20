import uDimension = require("Controls/Utils/getDimensions");
/**
 * TODO: Сделать правильные экспорты, чтобы можно было и в js писать просто new VirtualScroll() и в TS файле использовать типы
 */

type Direction = 'down' | 'up';

/**
 * Configuration object.
 *
 * @typedef VirtualScrollConfig
 * @type {object}
 * @property {number} virtualPageSize - The size of the virtual page indicates maximum number of simultaneously displayed items in the list.
 */
type VirtualScrollConfig = {
    virtualPageSize?: number;
}


/**
 * HTML container with elements.
 *
 * @typedef ItemsContainer
 * @type {Object}
 * @property {Array<HTMLElement>} children List items
 */
type ItemsContainer = {
    children: Array<HTMLElement>;
};


/**
 * Indexes of elements that should be mounted into the DOM.
 *
 * @remark The stop index is higher than the last item to show by one
 * @typedef ItemsIndexes
 * @type {Object}
 * @property {number} start - Index of the first element.
 * @property {number} stop - Index of the last element.
 */
type ItemsIndexes = {
    start: number;
    stop: number;
};


/**
 * The size of the placeholders that should be displayed instead of the "excessive" items.
 *
 * @typedef PlaceholdersSizes
 * @type {Object}
 * @property {number} top
 * @property {number} bottom
 */
type PlaceholdersSizes = {
    top: number;
    bottom: number;
};



/**
 *
 * @class Controls/_list/Controllers/VirtualScroll
 * @mixes Controls/_list/interface/IVirtualScroll
 *
 * @public
 * @author Авраменко А.С.
 */
class VirtualScroll {

    private readonly _virtualSegmentSize: number;
    private readonly _virtualPageSize: number = 100;

    private _startIndex: number = 0;
    private _stopIndex: number = 0;
    private _itemsCount: number = 0;
    private _itemsHeights: number[] = [];
    private _itemsContainer: ItemsContainer;
    private _topPlaceholderSize: number = 0;
    private _bottomPlaceholderSize: number = 0;


    get ItemsIndexes(): ItemsIndexes {
        return {
            start: this._startIndex,
            stop: this._stopIndex
        };
    }

    set StartIndex(startIndex: number): void {
        this._startIndex = Math.max(0, startIndex);
        this._stopIndex = Math.min(this._itemsCount, this._startIndex + this._virtualPageSize);
    }

    get ItemsHeights(): Array<number> {
        return this._itemsHeights;
    }

    get PlaceholdersSizes(): PlaceholdersSizes {
        return {
            top: this._topPlaceholderSize,
            bottom: this._bottomPlaceholderSize
        };
    }

    set ItemsCount(value: number) {
        this._itemsCount = value;
    }

    set ItemsContainer(value: ItemsContainer) {
        this._itemsContainer = value;
    }

    get ItemsContainer(): ItemsContainer {
        return this._itemsContainer;
    }

    /**
     * @constructor
     * @this  {VirtualScroll}
     * @param {VirtualScrollConfig} cfg
     */
    public constructor(cfg: VirtualScrollConfig) {
        this._virtualPageSize = cfg.virtualPageSize || this._virtualPageSize;
        this._virtualSegmentSize = Math.ceil(this._virtualPageSize / 4);
    }

    public resetItemsIndexes(): void {
        this._startIndex = 0;
        this._stopIndex = Math.min(this._startIndex + this._virtualPageSize, this._itemsCount);
        this._itemsHeights = [];
        this._updatePlaceholdersSizes();
    }

    public updateItemsSizes(): void {
        let
            startUpdateIndex = this._startIndex,
            items = this._itemsContainer.children,
            updateLength = Math.min(this._stopIndex - this._startIndex, items.length);

        this._updateItemsSizes(startUpdateIndex, updateLength);
        this._updatePlaceholdersSizes();
    }

    // метод для того, чтобы пересчитать текущие индексы согласно обновленному количеству отображаемых элементов.
    // + нужно работать с проекцией, т.к. группировка, хлебные крошки только в ней учитываются.
    // когда данный метод планируется вызывать:
    // когда загрузили новую страницу
    public recalcItemsIndexes(direction: string, scrollParams: object, triggerOffset: number): void {
        // допустим показывали при первой загрузке с 0 по 27 элемент, а virtualPageSize = 40.
        // докрутили до триггера загрузки итемов, загрузили ещё 20 элементов,
        // показываем с 20 по 47 индексы
        // а надо показывать с 7 по 47 индексы.
        const topTriggerDistance = this._calcDistanceBetweenTriggerAndViewport('top', scrollParams, this._startIndex, this._stopIndex, triggerOffset);
        const bottomTriggerDistance = this._calcDistanceBetweenTriggerAndViewport('bottom', scrollParams, this._startIndex, this._stopIndex, triggerOffset);
        let newStartIndex = this._startIndex;
        let newStopIndex = this._stopIndex;

        const
           sub = this._virtualPageSize - (newStopIndex - newStartIndex); // 40 - (27 - 0) = 13
        if (sub > 0) { // 13 > 0
            if (direction === 'up') {
                // при direction === 'up' максимально уменьшаем startIndex
                if (newStartIndex >= sub) { // если startIndex полностью хватает для компенсации, то берем всё из него
                    newStartIndex -= sub;
                } else { // иначе - берем сколько можем из startIndex, остальное возьмем из stopIndex.
                    newStartIndex = 0;
                }
                newStopIndex = Math.min(newStartIndex + this._virtualPageSize, this._itemsCount);
            }
            if (direction === 'down') {
                // а при direction === 'down' наоборот - максимально увеличиваем stopIndex
                newStopIndex = Math.min(newStartIndex + this._virtualPageSize, this._itemsCount);
                newStartIndex = Math.max(newStopIndex - this._virtualPageSize, 0);
                // если всё ещё мало записей - можно попробовать уменьшать startIndex ВОТ В ЭТОМ МЕСТЕ.
            }
        }
        if (direction === 'up') {
            if (newStopIndex < this._stopIndex) {
                newStopIndex = Math.min(newStopIndex + this._calcIndexCompensationByTriggerDistance(bottomTriggerDistance, 'up', newStopIndex, this._stopIndex), this._itemsCount);
            }
        } else {
            newStartIndex = Math.max(newStartIndex - this._calcIndexCompensationByTriggerDistance(topTriggerDistance, 'down', this._startIndex, newStartIndex), 0);
        }
        this._startIndex = newStartIndex;
        this._stopIndex = newStopIndex;
        this._updatePlaceholdersSizes();
    }

    // метод для того, чтобы пересчитать текущие индексы при скролле
    // (аналог loadToDirection, но не загружает данные с источника, а оперирует уже имеющимися в рекордсете)
    // + нужно работать с проекцией, т.к. группировка, хлебные крошки только в ней учитываются.
    // когда данный метод планируется вызывать:
    // скролл вверх/вниз
    public recalcToDirection(direction: string, scrollParams: object, triggerOffset: number): void {
        const topTriggerDistance = this._calcDistanceBetweenTriggerAndViewport('top', scrollParams, this._startIndex, this._stopIndex, triggerOffset);
        const bottomTriggerDistance = this._calcDistanceBetweenTriggerAndViewport('bottom', scrollParams, this._startIndex, this._stopIndex, triggerOffset);
        let newStartIndex = this._startIndex;
        let newStopIndex = this._stopIndex;

        // допустим показывали с 7 по 47
        // докрутили до верхнего триггера загрузки виртуального скрола, нужно нарисовать ещё 10 элементов вверх, а есть только 7
        // показываем с 0 по 40 индексы

        if (direction === 'up') {
            if (newStartIndex >= this._virtualSegmentSize) {
                newStartIndex -= this._virtualSegmentSize;
            } else {
               newStartIndex = 0;
            }
            newStopIndex = Math.min(newStartIndex + this._virtualPageSize, this._itemsCount);
        } else {
            // допустим показывали с 15 до 45 записи, а всего их 50.
            // скролим вниз, должны показывать с 20 по 50.

            // если для сдвига stopIndex хватает количества элементов, то просто увеличиваем stopIndex
            if (newStopIndex + this._virtualSegmentSize <= this._itemsCount) { // 45 + 10 = 55, 55 < 50
                const
                    sub = this._virtualPageSize - newStopIndex;

                // Если изначально показывается настолько мало записей, что после обновления индексов количество записей
                // все равно меньше, чем виртуальная страница, то увеличиваем индексы на сколько возможно.
                newStopIndex +=  sub > this._virtualSegmentSize ?  sub : this._virtualSegmentSize;
            } else { // иначе - сдвигаем на сколько можем, остальное пытаемся взять из _startIndex
                const
                   sub = this._itemsCount - newStopIndex; // 45 + 10 - 50 = 5
                newStopIndex += sub;
            }
        }
        newStartIndex = Math.max(newStopIndex - this._virtualPageSize, 0);
        if (direction === 'up') {
            if (newStopIndex < this._stopIndex) {
                newStopIndex = Math.min(newStopIndex + this._calcIndexCompensationByTriggerDistance(bottomTriggerDistance, 'up', newStopIndex, this._stopIndex), this._itemsCount);
            }
        } else {
            newStartIndex = Math.max(newStartIndex - this._calcIndexCompensationByTriggerDistance(topTriggerDistance, 'down', this._startIndex, newStartIndex), 0);
        }
        if (direction === 'up' && newStartIndex !== this._startIndex ||
            direction === 'down' && newStopIndex !== this._stopIndex) {
            this._startIndex = newStartIndex;
            this._stopIndex = newStopIndex;
            this._updatePlaceholdersSizes();
        }
    }

    private _calcIndexCompensation(triggerDistance: number,
                                   direction: string,
                                   baseIndex: number): number {
        let newTriggerDistance = triggerDistance;
        let idx;
        if (direction === 'down') {
            idx = baseIndex;
            while (newTriggerDistance < 0 && idx < this._itemsCount && this._itemsHeights[idx]) {
                newTriggerDistance += this._itemsHeights[idx];
                idx++;
            }
            return idx - baseIndex;
        }
        idx = baseIndex;
        while (newTriggerDistance < 0 && idx - 1 > 0 && this._itemsHeights[idx - 1]) {
            newTriggerDistance += this._itemsHeights[idx - 1];
            idx--;
        }
        return baseIndex - idx;
    }

    private _calcIndexCompensationByTriggerDistance(triggerDistance: number,
                                                    direction: string,
                                                    firstIndex: number,
                                                    lastIndex: number): number {
        const count = lastIndex - firstIndex;
        let removedContentSize = 0;
        let idx;
        if (direction === 'down') {
            idx = firstIndex;
            while (idx < lastIndex && removedContentSize + this._itemsHeights[idx] < triggerDistance) {
                removedContentSize += this._itemsHeights[idx];
                idx++;
                count--;
            }
        } else {
            idx = lastIndex - 1;
            while (idx >= firstIndex && removedContentSize + this._itemsHeights[idx] < triggerDistance) {
                removedContentSize += this._itemsHeights[idx];
                idx--;
                count--;
            }
        }
        return count;
    }

    private _calcDistanceBetweenTriggerAndViewport(trigger: string, scrollParams: object, startIndex: number, stopIndex: number, triggerOffset: number): number {
       if (trigger === 'top') {
          return scrollParams.scrollTop - triggerOffset;
       } else {
          const itemsHeight = this._getItemsHeight(startIndex, stopIndex);
          return itemsHeight - (scrollParams.scrollTop + scrollParams.clientHeight + triggerOffset);
       }
    }

    recalcByIndex(index): void {
        let shift = Math.trunc(this._virtualPageSize / 2);
        if (index >= shift) {
            this._startIndex = index - shift;
            const newStopIndex = index + shift;
            this._stopIndex = Math.min(newStopIndex, this._itemsCount);
            if (this._stopIndex < newStopIndex) {
                this._startIndex = Math.max(this._startIndex - (newStopIndex - this._itemsCount), 0);
            }
        } else {
            this._stopIndex = Math.min(index + shift + (shift - index), this._itemsCount);
            this._startIndex = 0;
        }
        this._updatePlaceholdersSizes();
    }

    recalcToDirectionByScrollTop(scrollParams: object, triggerOffset: number): void {
        const scrollTop = scrollParams.scrollTop;
        let newStartIndex = 0;
        let tempPlaceholderSize = 0;
        while (tempPlaceholderSize + this._itemsHeights[newStartIndex] <= scrollTop - triggerOffset) {
            tempPlaceholderSize += this._itemsHeights[newStartIndex];
            newStartIndex++;
        }
        this._startIndex = Math.max(newStartIndex - (Math.trunc(this._virtualSegmentSize / 2)), 0);
        this._stopIndex = Math.min(this._startIndex + this._virtualPageSize, this._itemsCount);
        this._updatePlaceholdersSizes();
        this._compensationIndexesByTriggerVisibility({
            clientHeight: scrollParams.clientHeight,
            offsetHeight: scrollParams.offsetHeight,
            scrollTop: scrollParams.scrollTop - this._topPlaceholderSize
        }, triggerOffset);
    }

    private _compensationIndexesByTriggerVisibility(scrollParams: object, triggerOffset: number): void {
        const topTriggerDistance = this._calcDistanceBetweenTriggerAndViewport('top', scrollParams, this._startIndex, this._stopIndex, triggerOffset);
        const newStartIndex = Math.max(this._startIndex - this._calcIndexCompensation(topTriggerDistance, 'up', this._startIndex), 0);
        if (newStartIndex !== this._startIndex) {
            this._startIndex = newStartIndex;
            this._updatePlaceholdersSizes();
        }
        const bottomTriggerDistance = this._calcDistanceBetweenTriggerAndViewport('bottom', scrollParams, this._startIndex, this._stopIndex, triggerOffset);
        const newStopIndex = Math.min(this._stopIndex + this._calcIndexCompensation(bottomTriggerDistance, 'down', this._stopIndex), this._itemsCount);
        if (newStopIndex !== this._stopIndex) {
            this._stopIndex = newStopIndex;
            this._updatePlaceholdersSizes();
        }
    }

    public insertItemsHeights(itemIndex: number, itemsHeightsCount: number): void {
        let topItemsHeight = this._itemsHeights.slice(0, itemIndex + 1),
            insertedItemsHeights = [],
            bottomItemsHeight = this._itemsHeights.slice(itemIndex + 1);

        for (let i = 0; i < itemsHeightsCount; i++) {
            insertedItemsHeights[i] = 0;
        }

        this._itemsHeights = topItemsHeight.concat(insertedItemsHeights, bottomItemsHeight);
    }

    public cutItemsHeights(itemIndex: number, itemsHeightsCount: number): void {
        this._itemsHeights.splice(itemIndex + 1, itemsHeightsCount);
    }

    public hasEnoughDataToDirection(direction: Direction): boolean {
        if (direction === 'up') {
            return this._startIndex >= this._virtualSegmentSize;
        } else {
            return this._itemsCount >= this._stopIndex + this._virtualSegmentSize;
        }
    }

    public getItemsHeight(start: number, stop: number): number {
        return this._getItemsHeight(start, stop);
    }

    private _isEnd(): boolean {
        return (this._itemsHeights.length === this._itemsCount) && (this._stopIndex >= this._itemsHeights.length);
    }

    private _isScrollInPlaceholder(scrollTop: number, containerHeight: number = 0): boolean {

        if (this._topPlaceholderSize === 0 && this._bottomPlaceholderSize === 0) {
            return false;
        }

        let
            topPlaceholderEnd = this._topPlaceholderSize,
            bottomPlaceholderStart = this._topPlaceholderSize + this._getItemsHeight(this._startIndex, this._stopIndex);

        return ((scrollTop <= topPlaceholderEnd) || ((scrollTop + containerHeight) >= bottomPlaceholderStart));
    }

    private _getItemsHeight(startIndex: number, stopIndex: number): number {
        let height = 0,
            heights = this._itemsHeights;
        if (typeof heights[startIndex] !== "undefined" && typeof heights[stopIndex - 1] !== "undefined") {
            for (let i = startIndex; i < stopIndex; i++) {
                height += heights[i];
            }
        }
        return height;
    }

    private _updatePlaceholdersSizes(): void {
        this._topPlaceholderSize = this._getItemsHeight(0, this._startIndex);
        this._bottomPlaceholderSize = this._getItemsHeight(this._stopIndex, this._itemsHeights.length);
    }

    private _updateItemsSizes(startUpdateIndex, updateLength, isUnitTesting = false): void {
        for (let i = 0; i < updateLength; i++) {
            this._itemsHeights[startUpdateIndex + i] = this._getRowHeight(this._itemsContainer.children[i], isUnitTesting);
        }
    }

    private _getRowHeight(row: HTMLElement, isUnitTesting: boolean): number {
        /*
         * uDimension работает с window, для того чтобы протестировать функцию есть параметр isUnitTesting
         */
        return isUnitTesting ? row.offsetHeight : uDimension(row).height;
    }
}

export = VirtualScroll;
