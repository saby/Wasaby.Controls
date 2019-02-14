///<amd-module name="Controls/List/Controllers/VirtualScroll" />
import uDimension = require("Controls/Utils/getDimensions");
import IoC = require("Core/IoC");


/**
 * Configuration object.
 *
 * @typedef VirtualScrollConfig
 * @type {object}
 * @property {number} virtualPageSize - The maximum number of elements that will be in the DOM at the same time.
 * @property {number} virtualSegmentSize - your name.
 * @property {ItemsHeightsState} itemsHeightsState - Specifies whether the height of the element will change after the
 * first rendering or whether it will always be constant.
 * @property {ItemsRenderMode} itemsRenderMode - Specifies how items will be loaded.
 */
type VirtualScrollConfig = {
    virtualPageSize?: number;
    virtualSegmentSize?: number;

    // TODO: Согласвать
    itemsHeightsState?: ItemsHeightsState | string;
    itemsRenderMode?: ItemsRenderMode | string;

    /**
     * @deprecated
     */
    updateItemsHeightsMode?:string;
};


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
 * Enum for items heights states.
 * Specifies whether the height of the element will change after the first rendering
 * or whether it will always be constant.
 *
 * @enum
 * @variant Constant - Height of element will be always constant.
 * @variant Changeable - Height of element can change after the first rendering.
 */
enum ItemsHeightsState {
    Constant, Changeable
}


/**
 * Enum for items render mode.
 * Specifies how items will be loaded.
 *
 * @enum {number}
 * @variant Partially - Items will be downloaded in parts. The maximum number of items in collection will change as the data is loaded
 * @variant AllAtOnce - All items will be loaded at once. The maximum number of items in collection will not change.
 */
enum ItemsRenderMode {
    Partially, AllAtOnce
}



/**
 * @class Controls/List/Controllers/VirtualScroll
 * @author Rodionov E.A.
 * @public
 * @category List
 * */
export class VirtualScroll {

    private readonly _virtualSegmentSize: number = 20;
    private readonly _virtualPageSize: number = 100;
    private _itemsHeightsState: ItemsHeightsState;
    private _itemsRenderMode: ItemsRenderMode;
    private readonly _initialStartIndex: number = 0;

    private _startIndex: number;
    private _stopIndex: number;
    private _itemsCount: number;
    private _itemsHeights: number[] = [];
    private _itemsContainer: ItemsContainer;
    private _topPlaceholderSize: number = 0;
    private _bottomPlaceholderSize: number = 0;
    private _needToUpdateAllItemsHeight: boolean = false;


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

    /**
     * @constructor
     * @this  {VirtualScroll}
     * @param {VirtualScrollConfig} cfg
     */
    public constructor(cfg: VirtualScrollConfig) {
        this._virtualPageSize = cfg.virtualPageSize || this._virtualPageSize;
        this._virtualSegmentSize = cfg.virtualSegmentSize || this._virtualSegmentSize;
        this._startIndex = this._initialStartIndex;
        this._stopIndex = this._startIndex + this._virtualPageSize;
        this.ItemsHeightsState = cfg.itemsHeightsState || cfg.updateItemsHeightsMode || ItemsHeightsState.Constant;
        this.ItemsRenderMode = cfg.itemsRenderMode || ItemsRenderMode.Partially;
    }


    //<editor-fold desc="Public API">

    public resetItemsIndexes(startIndex = this._initialStartIndex): void {
        this._startIndex = startIndex;
        this._stopIndex = this._startIndex + this._virtualPageSize;
        this._itemsHeights = [];
        this._topPlaceholderSize = this._bottomPlaceholderSize = 0;
    }

    public updateItemsSizes(): void {
        let
            startUpdateIndex,
            updateLength,
            items = this._itemsContainer.children,
            itemsHeights = this._itemsHeights,
            isNeedToUpdate: boolean = false;

        /*
        * Если отображаестя всегда одинаковое кол-во блоков (несколько настоящих записей и заглушки вместо лишних),
        * то нужно каждый раз обновлять высоты всех элементов, потому вместо заглушки могла появиться запись с
        * другими размерами.
        * */
        if (this._itemsRenderMode === ItemsRenderMode.AllAtOnce) {
            startUpdateIndex = 0;
            updateLength = items.length;
            isNeedToUpdate = true;
        } else {
            // По умолчанию, обновляем висоты, только если появились новые элементы
            isNeedToUpdate = (typeof itemsHeights[this._startIndex] === "undefined" || typeof itemsHeights[this._stopIndex - 1] === "undefined");

            // Если отображаем только реальные записи, то обновляем только их высоты.
            if (this._itemsRenderMode === ItemsRenderMode.Partially) {
                startUpdateIndex = this._startIndex;
                updateLength = Math.min(this._stopIndex - this._startIndex, items.length);
            }

            /*
            * Флаг, выставляется после вставки элементов в середину коллекции (раскрытия узла дерева), в массиве уже
            * есть высоты с такими индексами, но они пока неподсчитаны
            */
            if (this._needToUpdateAllItemsHeight){
                isNeedToUpdate = true;
                this._needToUpdateAllItemsHeight = false;
            }
        }

        if (isNeedToUpdate) {
            for (let i = 0; i < updateLength; i++) {
                itemsHeights[startUpdateIndex + i] = uDimension(items[i]).height;
            }
            this._updatePlaceholdersSizes();
        }
    }

    public updateItemsIndexesOnToggle(toggledItemIndex, isExpanded, childItemsCount): void {
        if (!!childItemsCount) {
            if (isExpanded) {

                let topItemsHeight = this._itemsHeights.slice(0, toggledItemIndex + 1),
                    insertedItemsHeights = new Array(childItemsCount),
                    bottomItemsHeight = this._itemsHeights.slice(toggledItemIndex + 1);

                this._itemsHeights = topItemsHeight.concat(insertedItemsHeights, bottomItemsHeight);
            } else {
                this._itemsHeights.splice(toggledItemIndex + 1, childItemsCount);
            }
        }
        this._needToUpdateAllItemsHeight = true;
        this._stopIndex = Math.min(this._itemsCount, this._startIndex + this._virtualPageSize);
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
    //</editor-fold>

    //<editor-fold desc="Private methods" defaultstate="collapsed" >

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

    //</editor-fold>

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

    private set ItemsHeightsState(value: ItemsHeightsState | string) {
        let _state = VirtualScroll._convertOptionToEnum<ItemsHeightsState>(<string>value, ItemsHeightsState);

        if (!_state && _state !== 0) {
            _state = ItemsHeightsState.Constant;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Option "itemsHeightsState" is not a part of enum "ItemsHeightsState". ' +
                    'ItemsHeightsState has been settled into default value (ItemsHeightsState.Constant)');
        }

        this._itemsHeightsState = _state;
    }

    private set ItemsRenderMode(value: ItemsRenderMode | string) {
        let _state = VirtualScroll._convertOptionToEnum<ItemsRenderMode>(<string>value, ItemsRenderMode);

        if (!_state && _state !== 0) {
            _state = ItemsRenderMode.Partially;
            IoC.resolve('ILogger')
                .warn(
                    'VirtualScroll',
                    'Option "itemsHeightsState" is not a part of enum "ItemsHeightsState". ' +
                    'ItemsHeightsState has been settled into default value (ItemsHeightsState.Constant)');
        }

        this._itemsRenderMode = _state;
    }

    private static _convertOptionToEnum<T>(option: string, enumType: any): T | null {
        if (typeof option === "string") {
            if ((<T>enumType)[option] || enumType[option] === 0) {
                return <T>enumType[option];
            } else {
                return undefined;
            }
        } else {
            return option;
        }
    }

    //</editor-fold>

}

