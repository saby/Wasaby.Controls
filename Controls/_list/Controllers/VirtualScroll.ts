import uDimension = require("Controls/Utils/getDimensions");
import {IoC} from "Env/Env";
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
 * @property {number} virtualSegmentSize - Number of items that will be inserted/removed on reaching the end of displayed items.
 */
type VirtualScrollConfig = {
    virtualPageSize?: number;
    virtualSegmentSize?: number;
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
 * @author Родионов Е.А.
 */
class VirtualScroll {

    private readonly _virtualSegmentSize: number = 10;
    private readonly _virtualPageSize: number = 100;

    private _startIndex: number = 0;
    private _stopIndex: number;
    private _itemsCount: number;
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
        this._virtualSegmentSize = cfg.virtualSegmentSize || this._virtualSegmentSize;
        this._stopIndex = this._startIndex + this._virtualPageSize;
    }


    public resetItemsIndexes(): void {
        this._startIndex = 0;
        this._stopIndex = this._startIndex + this._virtualPageSize;
        this._itemsHeights = [];
        this._topPlaceholderSize = this._bottomPlaceholderSize = 0;
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
    public recalcItemsIndexes(direction): void {

        // допустим показывали при первой загрузке с 0 по 27 элемент, а virtualPageSize = 40.
        // докрутили до триггера загрузки итемов, загрузили ещё 20 элементов,
        // показываем с 20 по 47 индексы
        // а надо показывать с 7 по 47 индексы.
        const
           sub = this._virtualPageSize - (this._stopIndex - this._startIndex); // 40 - (27 - 0) = 13
        if (sub > 0) { // 13 > 0
            if (direction === 'up') {
                // при direction === 'up' максимально уменьшаем startIndex
                if (this._startIndex >= sub) { // если startIndex полностью хватает для компенсации, то берем всё из него
                    this._startIndex -= sub;
                } else { // иначе - берем сколько можем из startIndex, остальное возьмем из stopIndex.
                    this._startIndex = 0;
                }
                this._stopIndex = Math.min(this._startIndex + this._virtualPageSize, this._itemsCount);
            }
            if (direction === 'down') {
                // а при direction === 'down' наоборот - максимально увеличиваем stopIndex
                this._stopIndex = Math.min(this._startIndex + this._virtualPageSize, this._itemsCount);
                this._startIndex = Math.max(this._stopIndex - this._virtualPageSize, 0);
                // если всё ещё мало записей - можно попробовать уменьшать startIndex ВОТ В ЭТОМ МЕСТЕ.
            }
        }
    }

    // метод для того, чтобы пересчитать текущие индексы при скролле
    // (аналог loadToDirection, но не загружает данные с источника, а оперирует уже имеющимися в рекордсете)
    // + нужно работать с проекцией, т.к. группировка, хлебные крошки только в ней учитываются.
    // когда данный метод планируется вызывать:
    // скролл вверх/вниз
    public recalcToDirection(direction): void {

        // допустим показывали с 7 по 47
        // докрутили до верхнего триггера загрузки виртуального скрола, нужно нарисовать ещё 10 элементов вверх, а есть только 7
        // показываем с 0 по 40 индексы

        if (direction === 'up') {
            if (this._startIndex >= this._virtualSegmentSize) {
                this._startIndex -= this._virtualSegmentSize;
            } else {
               this._startIndex = 0;
            }
            this._stopIndex = Math.min(this._startIndex + this._virtualPageSize, this._itemsCount);
        } else {
            // допустим показывали с 15 до 45 записи, а всего их 50.
            // скролим вниз, должны показывать с 20 по 50.

            // если для сдвига stopIndex хватает количества элементов, то просто увеличиваем stopIndex
            if (this._stopIndex + this._virtualSegmentSize <= this._itemsCount) { // 45 + 10 = 55, 55 < 50
                const
                    sub = this._virtualPageSize - this._stopIndex;

                // Если изначально показывается настолько мало записей, что после обновления индексов количество записей
                // все равно меньше, чем виртуальная страница, то увеличиваем индексы на сколько возможно.
                this._stopIndex +=  sub > this._virtualSegmentSize ?  sub : this._virtualSegmentSize;
            } else { // иначе - сдвигаем на сколько можем, остальное пытаемся взять из _startIndex
                const
                   sub = this._itemsCount - this._stopIndex; // 45 + 10 - 50 = 5
                this._stopIndex += sub;
            }
            this._startIndex = Math.max(this._stopIndex - this._virtualPageSize, 0);
        }
    }

    recalcToDirectionByScrollTop(direction, scrollTop): void {
        let
           newStartIndex = 0,
           tempPlaceholderSize = 0;
        while (tempPlaceholderSize + this._itemsHeights[newStartIndex] <= scrollTop) {
            tempPlaceholderSize += this._itemsHeights[newStartIndex];
            newStartIndex++;
        }
        this._startIndex = Math.max(newStartIndex - (Math.trunc(this._virtualSegmentSize / 2)), 0);
        this._stopIndex = Math.min(this._startIndex + this._virtualPageSize, this._itemsCount);
        this.recalcItemsIndexes(direction);
        this._topPlaceholderSize = 0;
        for (let i = 0; i < this._startIndex; i++) {
            this._topPlaceholderSize += this._itemsHeights[i];
        }
        this._bottomPlaceholderSize = 0;
        for (let i = this._stopIndex; i < this._itemsHeights.length; i++) {
            this._bottomPlaceholderSize += this._itemsHeights[i];
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

    updatePlaceholdersSizes(): void {
        this._updatePlaceholdersSizes();
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
