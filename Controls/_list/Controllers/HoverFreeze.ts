import {Model} from 'Types/entity';
import {CrudEntityKey} from 'Types/source';
import {SyntheticEvent} from 'UI/Vdom';

import {Collection, CollectionItem} from 'Controls/display';

const HOVER_FREEZE_TIMEOUT: number = 200;
const HOVER_UNFREEZE_TIMEOUT: number = 50;

const ITEM_ACTIONS_SELECTOR = '.controls-itemActionsV';

interface IMouseMoveArea {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface IHoverFreezeOptions {
    uniqueClass: string;
    collection: Collection<Model, CollectionItem>;
    stylesContainer: HTMLElement;
    viewContainer: HTMLElement;
    freezeHoverCallback: () => void;
    unFreezeHoverCallback: () => void;
}

/**
 * Контроллер, позволяющий "замораживать" текущее состояние hover с itemActionsPosition=outside для записи под курсором.
 */
export default class HoverFreeze {
    private _itemKey: CrudEntityKey = null;
    private _uniqueClass: string;
    private _collection: Collection<Model, CollectionItem>;
    private _stylesContainer: HTMLElement;
    private _viewContainer: HTMLElement;
    private _freezeHoverCallback: () => void;
    private _unFreezeHoverCallback: () => void;
    private _moveArea: IMouseMoveArea;
    private _itemFreezeHoverTimeout: number;
    private _itemUnfreezeHoverTimeout: number;

    constructor(options: IHoverFreezeOptions) {
        this.updateOptions(options);
    }

    updateOptions(options: IHoverFreezeOptions): void {
        this._uniqueClass = options.uniqueClass;
        this._collection = options.collection;
        this._stylesContainer = options.stylesContainer;
        this._viewContainer = options.viewContainer;
        this._freezeHoverCallback = options.freezeHoverCallback;
        this._unFreezeHoverCallback = options.unFreezeHoverCallback;
    }

    /**
     * Возвращает ключ "замороженного" элемента.
     * Если возвращается null, значит ни один элемент не "заморожен"
     */
    getCurrentItemKey(): CrudEntityKey | null {
        return this._itemKey;
    }

    startFreezeHoverTimeout(item?: CollectionItem): void {
        const itemKey = item.getContents().getKey();
        const itemIndex = (item.index !== undefined ? item.index : this._collection.getIndex(item)) + 1;
        // если уже были таймеры разлипания/залипания, то глушим их
        this._clearUnfreezeHoverTimeout();
        this._clearFreezeHoverTimeout();

        if (this._itemKey !== itemKey) {
            // Стартуем новый таймер залипания.
            this._itemFreezeHoverTimeout = setTimeout(() => {
                // Если есть залипшая запись, то надо понять это та же запись, по которой мы сейчас сделали ховер
                // или нет. Если нет, то всё надо сбросить.
                if (this._itemKey !== null) {
                    // Размораживаем текущую запись, т.к. она более не должна являться замороженной
                    this.unfreezeHover();
                }

                // Далее, выставляем новую запись как залипшую:
                this._freezeHover(itemIndex);
                // сохранили текущее наведённое значение
                this._itemKey = itemKey;
            }, HOVER_FREEZE_TIMEOUT);
        }
    }

    startUnfreezeHoverTimeout(event: SyntheticEvent): void {
        // если уже были таймеры разлипания/залипания, то глушим их
        this._clearUnfreezeHoverTimeout();
        this._clearFreezeHoverTimeout();

        const x = (event.nativeEvent as MouseEvent).clientX;
        const y = (event.nativeEvent as MouseEvent).clientY;

        // Размораживаем текущую запись, т.к. она более не должна являться замороженной
        if (this._isCursorInsideOfMouseMoveArea(x, y)) {
            this._itemUnfreezeHoverTimeout = setTimeout(() => {
                this.unfreezeHover();
            }, HOVER_UNFREEZE_TIMEOUT);
        } else {
            this.unfreezeHover();
        }
    }

    restartUnfreezeHoverTimeout(event: SyntheticEvent): void {
        if (this._itemKey !== null && !!this._itemUnfreezeHoverTimeout) {
            this.startUnfreezeHoverTimeout(event);
        }
    }

    unfreezeHover(): void {
        // Сбрасываем текущий ховер
        this._itemKey = null;
        this._moveArea = null;
        this._stylesContainer.innerHTML = '';
        if (this._freezeHoverCallback) {
            this._unFreezeHoverCallback();
        }
    }

    private _isCursorInsideOfMouseMoveArea(x: number, y: number): boolean {
        if (!this._moveArea) {
            return false;
        }
        return x < this._moveArea.right && x > this._moveArea.left &&
            y < this._moveArea.bottom && y > this._moveArea.top;
    }

    private _clearFreezeHoverTimeout(): void {
        if (this._itemFreezeHoverTimeout) {
            clearTimeout(this._itemFreezeHoverTimeout);
            this._itemFreezeHoverTimeout = null;
        }
    }

    private _clearUnfreezeHoverTimeout(): void {
        if (this._itemUnfreezeHoverTimeout) {
            clearTimeout(this._itemUnfreezeHoverTimeout);
            this._itemUnfreezeHoverTimeout = null;
        }
    }

    private _freezeHover(index: number): void {
        const hoveredContainers = this._getHoveredItemContainers(index);
        const backgroundColor = getComputedStyle(hoveredContainers[0]).backgroundColor;
        this._moveArea = this._calculateMouseMoveArea(hoveredContainers);
        this._stylesContainer.innerHTML = this._collection.getItemActionsOutsideFreezeStyles(this._uniqueClass, index);
        this._stylesContainer.innerHTML += this._collection.getItemHoverFreezeStyles(this._uniqueClass, index, backgroundColor);
        if (this._freezeHoverCallback) {
            this._freezeHoverCallback();
        }
    }

    // current hovered item containers
    private _getHoveredItemContainers(index: number): NodeListOf<HTMLElement> {
        const hoveredContainerSelector = this._collection.getItemHoveredContainerSelector(this._uniqueClass, index);
        return this._viewContainer.querySelectorAll(hoveredContainerSelector);
    }

    // Calculate move area as item area considering itemActions height
    private _calculateMouseMoveArea(hoveredContainers: NodeListOf<HTMLElement>): IMouseMoveArea {
        const lastContainer = hoveredContainers[hoveredContainers.length - 1];
        const itemActionsContainer = lastContainer.querySelector(ITEM_ACTIONS_SELECTOR);
        const resultRect = {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
        };
        let itemActionsHeight = 0;
        if (itemActionsContainer) {
            itemActionsHeight = (itemActionsContainer as HTMLElement).offsetHeight;
        }
        hoveredContainers.forEach((container) => {
            const containerRect = container.getBoundingClientRect();
            if (!resultRect.top) {
                resultRect.top = containerRect.top;
            }
            if (!resultRect.bottom) {
                resultRect.bottom = containerRect.top + containerRect.height + itemActionsHeight;
            }
            if (!resultRect.left) {
                resultRect.left = containerRect.left;
            }
            resultRect.right += containerRect.left + containerRect.width;
        });
        return resultRect;
    }
}
