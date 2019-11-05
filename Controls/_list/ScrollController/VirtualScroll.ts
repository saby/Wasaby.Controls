import {ObservableMixin as Observable} from 'Types/entity';
import {IDirection, IVirtualPageSizeMode, IVirtualScrollMode} from '../interface/IVirtualScroll';


type IVirtualItem = number;

interface IVirtualScrollControllerOptions {
    pageSize: number;
    segmentSize: number;
    pageSizeMode: IVirtualPageSizeMode;
    virtualScrollMode: IVirtualScrollMode;
    indexesChangedCallback: Function;
    loadMoreCallback: Function;
    placeholderChangedCallback: Function;
}

type IPlaceholders = [number, number];

/**
 * Контроллер расчета видимых данных
 * @author Волоцкой В.Д.
 */
export default class VirtualScrollController {
    private startIndex: number = 0;
    private stopIndex: number = 0;
    private segmentSize: number = 0;
    private pageSize: number = 0;
    private pageSizeMode: 'dynamic' | 'static';
    private virtualScrollMode: 'hide' | 'remove';
    private itemsHeights: IVirtualItem[] = [];
    private itemsOffsets: number[] = [];
    private indexesChangedCallback: Function;
    private loadMoreCallback: Function;
    private placeholderChangedCallback: Function;
    triggerOffset: number = 0;
    itemsCount: number = 0;
    viewportHeight: number = 0;
    scrollTop: number = 0;
    itemsContainerHeight: number = 0;

    private _itemsContainer: HTMLElement;

    set itemsContainer(container: HTMLElement) {
        this._itemsContainer = container;
        this.recalcItemsHeights();
    }

    get itemsContainer(): HTMLElement {
        return this._itemsContainer;
    }

    constructor(options: IVirtualScrollControllerOptions) {
        this.pageSize = options.pageSize || 100;
        this.pageSizeMode = options.pageSizeMode;
        this.segmentSize = options.segmentSize || this.pageSize / 4;
        this.virtualScrollMode = options.virtualScrollMode;
        this.indexesChangedCallback = options.indexesChangedCallback;
        this.loadMoreCallback = options.loadMoreCallback;
        this.placeholderChangedCallback = options.placeholderChangedCallback;
    }

    /**
     * Пересчет индексов "видимого" набора данных от индекса
     * @param {number} itemIndex
     */
    recalcFromIndex(itemIndex: number): void {
        let newStartIndex = this.startIndex;
        let newStopIndex = this.stopIndex;

        if (this.pageSize < this.itemsCount) {
            newStartIndex = itemIndex;
            newStopIndex = newStartIndex + this.pageSize - 1;

            if (newStopIndex >= this.itemsCount) {
                newStopIndex = this.itemsCount;
                newStartIndex = this.stopIndex - this.pageSize;
            }
        } else {
            newStartIndex = 0;
            newStopIndex = this.itemsCount;
        }

        this.checkIndexesChanged(newStartIndex, newStopIndex);
    }

    /**
     * Пересчет индексов "видимого" набора данных от нового количества элементов
     * @param direction
     * @param {number} segmentSize
     * @remark Необходимо вызывать когда произошла догрузка данных
     * @example
     * Перед загрузкой данных startIndex = 0, stopIndex = 19, itemsCount = 20
     * Подгрузилось 20 новых элементов, при этом pageSize = 40
     * При вызове recalcToDirection был бы пересчет индексов на startIndex = 19, stopIndex = 39, но это неверно, так как
     * у нас просто загрузились данные и нужно отобразить startIndex = 0, stopIndex = 39
     */
    recalcFromNewItems(direction, segmentSize: number = this.segmentSize): void {
        let newStartIndex = this.startIndex;
        let newStopIndex = this.stopIndex;

        const sub = this.pageSize - (newStopIndex - newStartIndex);
        const quantity = this.getItemsToHideQuantity(direction);

        if (sub > 0) {
            if (direction === 'up') {
                newStartIndex = Math.max(newStartIndex - sub, 0);
                newStopIndex = Math.min(newStartIndex + this.pageSize, this.itemsCount);

                if (newStopIndex < this.stopIndex) {
                    newStopIndex = Math.min(newStopIndex + quantity, this.itemsCount);
                }
            } else {
                newStopIndex = Math.min(newStartIndex + this.pageSize, this.itemsCount);
                newStartIndex = Math.max(newStopIndex - this.pageSize, 0);
                newStartIndex = Math.max(newStartIndex - quantity, 0);
            }
        }

        this.indexesChangedCallback(this.startIndex = newStartIndex, this.stopIndex = newStopIndex, direction);
        this.placeholderChangedCallback(this.calcPlaceholderSize());
    }

    /**
     * Пересчет индексов "видимого" набора данных при скроллировании
     * @param {IDirection} direction
     * @param {number} segmentSize
     */
    recalcToDirection(direction: IDirection, segmentSize: number = this.segmentSize): void {
        let newStartIndex = this.startIndex;
        let newStopIndex = this.stopIndex;
        let needToLoadMore: boolean = false;
        const quantity = this.getItemsToHideQuantity(direction);

        if (direction === 'up') {
            if (newStartIndex <= segmentSize) {
                needToLoadMore = true;
            }

            newStartIndex = Math.max(0, newStartIndex - segmentSize);
            newStopIndex -= quantity;
        } else {
            if (newStopIndex + segmentSize >= this.itemsCount) {
                needToLoadMore = true;
            }

            newStopIndex = Math.min( newStopIndex + segmentSize, this.itemsCount);
            newStartIndex += quantity;
        }

        if (this.pageSizeMode === 'static') {
            const difference = newStopIndex - newStartIndex;
            const sub = this.pageSize - difference;

            if (difference < this.pageSize) {
                if (direction === 'up') {
                    newStopIndex = Math.min(this.itemsCount, newStopIndex + sub);
                } else {
                    newStartIndex = Math.max(0, newStartIndex - sub);
                }
            }
        }

        this.checkIndexesChanged(newStartIndex, newStopIndex, direction);

        if (needToLoadMore) {
            this.loadMoreCallback(direction);
        }
    }

    /**
     * Вычисление индексов "видимого" набора данных от scrollTop
     * @remark Необходимо вызывать при изменении виртуального scrollTop
     */
    recalcFromScrollTop(): void {
        const scrollTop = this.scrollTop;
        let newStartIndex = 0;
        let tempPlaceholderSize = 0;
        while (tempPlaceholderSize + this.itemsHeights[newStartIndex] <= scrollTop - this.triggerOffset) {
            tempPlaceholderSize += this.itemsHeights[newStartIndex];
            newStartIndex++;
        }

        this.indexesChangedCallback(
            this.startIndex = Math.max(newStartIndex - (Math.trunc(this.pageSize / 2)), 0),
            this.stopIndex = Math.min(this.startIndex + this.pageSize, this.itemsCount));
        this.placeholderChangedCallback(this.calcPlaceholderSize());

    }

    /**
     * Обнуляет данные о записях, стартует виртуальный скроллинг с нуля
     */
    reset(): void {
        this.itemsHeights = [];
        this.itemsOffsets = [];
        this.indexesChangedCallback(this.startIndex = 0, this.stopIndex = Math.min(this.startIndex + this.pageSize,
            this.itemsCount));
        this.placeholderChangedCallback(this.calcPlaceholderSize());
    }

    /**
     * Пересчитывает высота "видимого" набора данных
     */
    recalcItemsHeights(): void {
        const startIndex = this.startIndex;
        const items = this._itemsContainer.children;
        const updateLength = Math.min(this.stopIndex - startIndex, items.length);

        this.updateItemsHeights(startIndex, updateLength);
        this.updateItemsOffsets();
    }

    /**
     * Возвращает сумму высот элементов с startIndex до stopIndex
     * @param {number} startIndex
     * @param {number} stopIndex
     * @returns {number}
     */
    getItemsHeights(startIndex: number, stopIndex: number): number {
        let height = 0;
        const items = this.itemsHeights;

        if (typeof items[startIndex] !== 'undefined' && typeof items[stopIndex - 1] !== 'undefined') {
            for (let i = startIndex; i < stopIndex; i++) {
                height += items[i];
            }
        }

        return height;
    }

    /**
     * Проверяет возможность подскроллить к элементу
     * @param {number} index
     * @returns {boolean}
     */
    canScrollToItem(index: number): boolean {
        let canScroll = false;

        if (this.startIndex <= index && this.stopIndex >= index) {
            if (this.viewportHeight < this.itemsContainer.offsetHeight - this.itemsOffsets[index]) {
                canScroll = true;
            }
        }

        return canScroll;
    }

    /**
     * Добавляет высоты записей
     * @param {number} itemIndex
     * @param {number} itemsHeightsCount
     */
    insertItemsHeights(itemIndex: number, itemsHeightsCount: number): void {
        let topItemsHeight = this.itemsHeights.slice(0, itemIndex),
            insertedItemsHeights = [],
            bottomItemsHeight = this.itemsHeights.slice(itemIndex);

        for (let i = 0; i < itemsHeightsCount; i++) {
            insertedItemsHeights[i] = 0;
        }

        this.itemsHeights = [...topItemsHeight, ...insertedItemsHeights, ...bottomItemsHeight];
    }

    /**
     * Удаляет высоты записей
     * @param {number} itemIndex
     * @param {number} itemsHeightsCount
     */
    cutItemsHeights(itemIndex: number, itemsHeightsCount: number): void {
        this.itemsHeights.splice(itemIndex, itemsHeightsCount);
    }

    /**
     * Выставляет стартовый индекс виртуальнного скролла
     * @param {number} index
     * @remark Нужен для загрузки данных вверх, так как в таком случае произойдет сдвиг "видимого" набора данных
     */
    setStartIndex(index: number): void {
        this.startIndex = Math.max(0, index);
        this.stopIndex = Math.min(this.itemsCount, this.startIndex + this.pageSize);
    }

    getActiveElement(): number {
        if (this.isScrolledToBottom()) {
            return this.stopIndex - 1;
        } else if (this.isScrolledToTop()) {
            return this.startIndex;
        } else {
            let itemIndex;
            const halfDivider = 2;
            const viewportCenter = this.scrollTop + (this.viewportHeight / halfDivider);

            for (let i = this.startIndex; i < this.stopIndex; i++) {
                if (this.itemsOffsets[i] < viewportCenter) {
                    itemIndex = i;
                } else {
                    break;
                }
            }

            return itemIndex;
        }
    }

    private isScrolledToBottom(): boolean {
        return this.stopIndex === this.itemsCount &&
            this.scrollTop + this.viewportHeight === this.itemsContainerHeight;
    }

    private isScrolledToTop(): boolean {
        return this.scrollTop === 0 && this.startIndex === 0;
    }

    /**
     * Проверяет поменялись ли индексы "видимого" набора данных
     * @param {number} newStartIndex
     * @param {number} newStopIndex
     * @param {string} direction
     */
    private checkIndexesChanged(newStartIndex: number, newStopIndex: number, direction?: string): void {
        if (this.stopIndex !== newStopIndex || this.startIndex !== newStartIndex) {
            this.indexesChangedCallback(this.startIndex = newStartIndex, this.stopIndex = newStopIndex, direction);
            this.placeholderChangedCallback(this.calcPlaceholderSize());
        }
    }

    /**
     * Вычисляет размеры виртуальных распорок
     * @returns {IPlaceholders}
     */
    private calcPlaceholderSize(): IPlaceholders {
        return [
            this.getItemsHeights(0, this.startIndex),
            this.getItemsHeights(this.stopIndex, this.itemsCount)
        ];
    }

    /**
     * Обновляет высоты "видимого" набора данных
     * @param {number} startUpdateIndex
     * @param {number} updateLength
     */
    private updateItemsHeights(startUpdateIndex: number, updateLength: number): void {
        if (this.virtualScrollMode === 'remove') {
            for (let i = 0; i < updateLength; i++) {
                this.itemsHeights[startUpdateIndex + i] = this._itemsContainer.children[i].offsetHeight;
            }
        } else {
            for (let i = this.startIndex; i < this.stopIndex; i++) {
                if (this._itemsContainer.children[i]) {
                    this.itemsHeights[i] = this._itemsContainer.children[i].offsetHeight;
                }
            }
        }
    }

    /**
     * Обновляет оффсеты "видимого" набора данных
     */
    private updateItemsOffsets(): void {
        let sum: number = 0;

        for (let i = this.startIndex; i < this.stopIndex; i++) {
            this.itemsOffsets[i] = sum;
            sum += this.itemsHeights[i];
        }
    }

    /**
     * Вычисляет количество элементов, не участвующих во вьюпорте
     * @param {IDirection} direction
     * @returns {number}
     */
    private getItemsToHideQuantity(direction: IDirection): number {
        let quantity = 0;
        const items = this.itemsHeights;

        if (direction === 'up') {
            let stopIndex = this.stopIndex - 1;
            const triggerDistance = this.viewportHeight + this.scrollTop + this.triggerOffset;

            while (this.itemsOffsets[stopIndex] > triggerDistance) {
                stopIndex--;
                quantity++;
            }
        } else {
            let startIndex = this.startIndex;
            let sumHeight = 0;
            const triggerDistance = this.scrollTop - this.triggerOffset;


            while (sumHeight + items[startIndex] < triggerDistance) {
                sumHeight += items[startIndex];
                quantity++;
                startIndex++;
            }
        }

        return quantity;
    }
}
