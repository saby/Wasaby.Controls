import uDimension = require("Controls/Utils/getDimensions");
import IoC = require("Core/IoC");

/**
 * TODO: Сделать правильные экспорты, чтобы можно было и в js писать просто new VirtualScroll() и в TS файле использовать типы
 */

/**
 * Configuration object.
 *
 * @typedef VirtualScrollConfig
 * @type {object}
 * @property {number} virtualPageSize - The maximum number of elements that will be in the DOM at the same time.
 * @property {number} virtualSegmentSize - your name.
 */
type VirtualScrollConfig = {
    virtualPageSize?: number;
    virtualSegmentSize?: number;
    startIndex?: number;
    updateItemsHeightsMode?: string;
}


/**
 * HTML container with elements.
 *
 * @typedef ItemsContainer
 * @type {Object}
 * @property {Array<HTMLElement>} children
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
 * @class Controls/_lists/Controllers/VirtualScroll
 * @author Rodionov E.A.
 * @public
 * */
class VirtualScroll {

    private readonly _virtualSegmentSize: number = 20;
    private readonly _virtualPageSize: number = 100;
    private readonly _initialStartIndex: number = 0;

    private _startIndex: number;
    private _stopIndex: number;
    private _itemsCount: number;
    private _itemsHeights: number[] = [];
    private _itemsContainer: ItemsContainer;
    private _topPlaceholderSize: number = 0;
    private _bottomPlaceholderSize: number = 0;
    private _needToUpdateAllItemsHeight: boolean = false;
    private _updateItemsHeightsMode: string = 'onChangeCollection';


    get ItemsIndexes(): ItemsIndexes {
        return {
            start: this._startIndex,
            stop: this._stopIndex
        };
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
        this.updateItemsSizes();
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
        this._updateItemsHeightsMode = cfg.updateItemsHeightsMode || this._updateItemsHeightsMode;

        this._startIndex = cfg.startIndex || this._initialStartIndex;
        this._stopIndex = this._startIndex + this._virtualPageSize;
    }


    public resetItemsIndexes(startIndex = this._initialStartIndex): void {
        this._startIndex = startIndex;
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

    //TODO Add enum BaseControl.Direction(LoadDirection) or List.Direction(LoadDirection)
    public updateItemsIndexes(direction: String): void {
        if (direction === 'down') {
            this._startIndex = this._startIndex + this._virtualSegmentSize;
            this._startIndex = Math.min(this._startIndex, this._itemsCount - this._virtualPageSize);
        } else {
            this._startIndex = this._startIndex - this._virtualSegmentSize;
        }
        this._startIndex = Math.max(0, this._startIndex);
        this._stopIndex = Math.min(this._itemsCount, this._startIndex + this._virtualPageSize);
        this._updatePlaceholdersSizes();
    }

    public insertItemsHeights(itemIndex: number, itemsHeightsCount: number): void {
        let topItemsHeight = this._itemsHeights.slice(0, itemIndex + 1),
            insertedItemsHeights = [],
            bottomItemsHeight = this._itemsHeights.slice(itemIndex + 1);

        for (let i = 0; i < itemsHeightsCount; i++) {
            insertedItemsHeights[i] = 0;
        }

        this._itemsHeights = topItemsHeight.concat(insertedItemsHeights, bottomItemsHeight);
        this._stopIndex = Math.min(this._itemsCount, this._startIndex + this._virtualPageSize);
        this._updatePlaceholdersSizes();
    }

    public cutItemsHeights(itemIndex: number, itemsHeightsCount: number): void {
        this._itemsHeights.splice(itemIndex + 1, itemsHeightsCount);
        this._stopIndex = Math.min(this._itemsCount, this._startIndex + this._virtualPageSize);
        this._updatePlaceholdersSizes();
    }

    public updateItemsIndexesOnToggle(toggledItemIndex, isExpanded, childItemsCount): void {
        if (!!childItemsCount) {
            if (isExpanded) {
                this.insertItemsHeights(toggledItemIndex, childItemsCount);
            } else {
                this.cutItemsHeights(toggledItemIndex, childItemsCount);
            }
        }
    }

    public updateItemsIndexesOnScrolling(scrollTop: number): void {
        if (this._isScrollInPlaceholder(scrollTop)) {
            let
                offsetHeight = 0,
                heightsCount = this._itemsHeights.length;

            for (let i = 0; i < heightsCount; i++) {
                offsetHeight += this._itemsHeights[i];

                // Находим первую видимую запись по скролл топу и считаем этот элемент серединой виртуальной страницы
                if (offsetHeight >= scrollTop) {
                    this._startIndex = Math.max(0, Math.ceil(i - this._virtualPageSize / 2));

                    // Проверяем, что собираемся показать элементы, которые были отрисованы ранее
                    if (this._startIndex + this._virtualPageSize > heightsCount) {
                        this._stopIndex = heightsCount;
                        this._startIndex = Math.max(0, heightsCount - this._virtualPageSize);
                    } else {
                        this._stopIndex = Math.min(this._startIndex + this._virtualPageSize, heightsCount);
                    }
                    break;
                }
            }

            this._updatePlaceholdersSizes();
        }
    }


    private _isScrollInPlaceholder(scrollTop: number): boolean {
        let itemsHeight = 0,
            topPlaceholderSize = this._getItemsHeight(0, this._startIndex);
        for (let i = this._startIndex; i < this._stopIndex; i++) {
            itemsHeight += this._itemsHeights[i];
        }
        return (scrollTop <= topPlaceholderSize || scrollTop >= (itemsHeight + topPlaceholderSize));
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
        /*
         * uDimension работает с window, для того чтобы протестировать функцию есть параметр isUnitTesting
         */
        if (this._updateItemsHeightsMode == 'onChangeCollection') {
            if (isUnitTesting) {
                for (let i = 0; i < updateLength; i++) {
                    this._itemsHeights[startUpdateIndex + i] = this._itemsContainer.children[i].offsetHeight;
                }
            } else {
                for (let i = 0; i < updateLength; i++) {
                    this._itemsHeights[startUpdateIndex + i] = uDimension(this._itemsContainer.children[i]).height;
                }
            }
        } else if (this._updateItemsHeightsMode === 'always') {
            for (var i = 0; i < this._itemsContainer.children.length; i++) {
                this._itemsHeights[i] = uDimension(this._itemsContainer.children[i]).height;
            }

        }

    }
    //<editor-fold desc="Don't use it! Deprecated methods and methods for compatible with non TS components" defaultstate="collapsed" >

    private _isLogged = {
        setItemsContainer: false,
        getItemsIndexes: false,
        getItemsHeights: false,
        getPlaceholdersSizes: false,
        setItemsCount: false,
    };

    // Old method to set _itemsContainer, now available setter
    // TODO: remove in 19.200
    private setItemsContainer(itemsContainer: ItemsContainer): void {
        if (!this._isLogged.setItemsContainer){
            this._isLogged.setItemsContainer = true;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Method "setItemsContainer" is deprecated and will be removed in 19.200. ' +
                    'Use setter for property "VirtualScroll.ItemsContainer".');
        }
        this.ItemsContainer = itemsContainer;
    }

    // Old method to get _itemsIndexes, now available getter
    // TODO: remove in 19.200
    private getItemsIndexes(): ItemsIndexes {
        if (!this._isLogged.getItemsIndexes){
            this._isLogged.getItemsIndexes = true;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Method "getItemsIndexes" is deprecated and will be removed in 19.200. ' +
                    'Use getter for property "VirtualScroll.ItemsIndexes".');
        }
        return this.ItemsIndexes;
    }

    // Old method to get _itemsHeights, now available getter
    // TODO: remove in 19.200
    private getItemsHeights(): Array<number> {
        if (!this._isLogged.getItemsHeights){
            this._isLogged.getItemsHeights = true;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Method "getItemsHeights" is deprecated and will be removed in 19.200. ' +
                    'Use getter for property "VirtualScroll.ItemsHeights".');
        }
        return this.ItemsHeights;
    }

    // Old method to get _itemsHeights, now available getter
    // TODO: remove in 19.200
    private getItemsHeight(): Array<number> {
        if (!this._isLogged.getItemsHeights){
            this._isLogged.getItemsHeights = true;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Method "getItemsHeight" is deprecated and will be removed in 19.200. ' +
                    'Use getter for property "VirtualScroll.ItemsHeights".');
        }
        return this.ItemsHeights;
    }


    // Old method to get _placeholdersSizes, now available getter
    // TODO: remove in 19.200
    private getPlaceholdersSizes(): PlaceholdersSizes {
        if (!this._isLogged.getPlaceholdersSizes) {
            this._isLogged.getPlaceholdersSizes = true;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Method "getPlaceholdersSizes" is deprecated and will be removed in 19.200. ' +
                    'Use getter for property "VirtualScroll.PlaceholdersSizes".');
        }
        return this.PlaceholdersSizes;
    }

    // - Old method to set _itemsCount, now available setter
    // TODO: remove in 19.200
    private setItemsCount(itemsCount: number): void {
        if (!this._isLogged.setItemsCount) {
            this._isLogged.setItemsCount = true;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Method "setItemsCount" is deprecated and will be removed in 19.200. ' +
                    'Use setter for property "VirtualScroll.ItemsCount".');
        }
        this.ItemsCount = itemsCount;
    }
    //</editor-fold>

}

export = VirtualScroll;
