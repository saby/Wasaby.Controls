import {CrudEntityKey} from 'Types/source';
import {SyntheticEvent} from 'UI/Vdom';

const HOVER_FREEZE_TIMEOUT: number = 200;
const HOVER_UNFREEZE_TIMEOUT: number = 50;

const ITEM_HOVER_CONTAINER_SELECTOR = '.js-controls-ListView_item-hover';
const EDITABLE_HOVER_CONTAINER_SELECTOR = '.js-controls-ListView_editable-hover';
const ITEM_ACTIONS_CONTAINER_SELECTOR = '.js-controls-itemActions';

interface IHoverFreezeItemData {
    key: CrudEntityKey;
    index: number;
}

interface IMouseMoveArea {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface IHoverFreezeOptions {
    uniqueClass: string;
    stylesContainer: HTMLElement;
    viewContainer: HTMLElement;
    freezeHoverCallback: () => void;
    unFreezeHoverCallback: () => void;
    measurableContainerSelector: string;
}

/**
 * Контроллер, позволяющий "замораживать" текущее состояние hover с itemActionsPosition=outside для записи под курсором.
 */
export default class HoverFreeze {
    private _itemData: IHoverFreezeItemData = null;
    private _delayedItemData: IHoverFreezeItemData = null;

    private _uniqueClass: string;
    private _stylesContainer: HTMLElement;
    private _viewContainer: HTMLElement;
    private _freezeHoverCallback: () => void;
    private _unFreezeHoverCallback: () => void;
    private _moveArea: IMouseMoveArea;
    private _itemFreezeHoverTimeout: number;
    private _itemUnfreezeHoverTimeout: number;
    private _measurableContainerSelector: string;

    constructor(options: IHoverFreezeOptions) {
        this.updateOptions(options);
    }

    updateOptions(options: IHoverFreezeOptions): void {
        this._uniqueClass = options.uniqueClass;
        this._stylesContainer = options.stylesContainer;
        this._viewContainer = options.viewContainer;
        this._freezeHoverCallback = options.freezeHoverCallback;
        this._unFreezeHoverCallback = options.unFreezeHoverCallback;
        this._measurableContainerSelector = options.measurableContainerSelector;
    }

    /**
     * Возвращает ключ "замороженного" элемента.
     * Если возвращается null, значит ни один элемент не "заморожен"
     */
    getCurrentItemKey(): CrudEntityKey | null {
        return this._itemData ? this._itemData.key : null;
    }

    /**
     * Запускает таймер заморозки записи.
     * Таймер реально запускается только если
     * сделали ховер по новой записи впервые или после "разморозки", или по текущей записи в "заморозке"
     * @param itemKey
     * @param itemIndex
     */
    startFreezeHoverTimeout(itemKey: CrudEntityKey, itemIndex: number): void {
        if (this._itemData === null || this._itemData?.key === itemKey) {
            // если уже были таймеры разлипания/залипания, то глушим их
            this._clearUnfreezeHoverTimeout();
            this._clearFreezeHoverTimeout();

            // Стартуем новый таймер залипания.
            this._itemFreezeHoverTimeout = setTimeout(() => {
                // Выставляем новую запись как залипшую:
                this._freezeHover(itemIndex);
                // сохранили текущее наведённое значение
                this._setItemData(itemKey, itemIndex);
                // Сбросили отложенный ховер
                this._delayedItemData = null;
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
                if (this._delayedItemData) {
                    this.startFreezeHoverTimeout(this._delayedItemData.key, this._delayedItemData.index);
                }
            }, HOVER_UNFREEZE_TIMEOUT);
        } else {
            this._delayedItemData = null;
            this.unfreezeHover();
        }
    }

    /**
     * Устанавливает запись, на которой отложенно должен сработать таймаут "заморозки",
     * если задан таймаут "разморозки" и есть уже "замороженная" запись.
     * Используется при движении курсора мыши внутри записи.
     * @param itemKey
     * @param itemIndex
     */
    setDelayedHoverItem(itemKey: CrudEntityKey, itemIndex: number): void {
        if (this._itemData !== null && !!this._itemUnfreezeHoverTimeout) {
            this._setDelayedItemData(itemKey, itemIndex);
        }
    }

    /**
     * Перезапускает таймаут "разморозки" ховера,
     * если задан таймаут "разморозки" и есть уже "замороженная" запись.
     * Используется при движении курсора мыши в области всего списка
     * @param event
     */
    restartUnfreezeHoverTimeout(event: SyntheticEvent): void {
        if (this._itemData !== null && !!this._itemUnfreezeHoverTimeout) {
            this.startUnfreezeHoverTimeout(event);
        }
    }

    /**
     * Немедленно "размораживает" запись
     */
    unfreezeHover(): void {
        // Сбрасываем текущий ховер
        this._itemData = null;
        this._moveArea = null;
        this._stylesContainer.innerHTML = '';
        this._clearUnfreezeHoverTimeout();
        if (this._freezeHoverCallback) {
            this._unFreezeHoverCallback();
        }
    }

    private _setItemData(key: CrudEntityKey, index: number): void {
        this._itemData = { key, index };
    }

    private _setDelayedItemData(key: CrudEntityKey, index: number): void {
        this._delayedItemData = { key, index };
    }

    /**
     * Проверяет, входят ли текущие координаты курсора мыши в зону перемещения курсора для последней "замороженной" записи
     * @param x
     * @param y
     * @private
     */
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

    /**
     * Устанавливает необходимые CSS классы и выполняет _freezeHoverCallback
     * @param index
     * @private
     */
    private _freezeHover(index: number): void {
        this._clearFreezeHoverTimeout();
        const htmlNodeIndex = index + 1;
        const hoveredContainers = this._getHoveredItemContainers(htmlNodeIndex);

        // zero element in grid will be row itself; it doesn't have any background color, then lets take the last one
        const hoverBackgroundColor = getComputedStyle(hoveredContainers[hoveredContainers.length - 1]).backgroundColor;

        const hoveredEditingTemplateTextContainer = this._getEditingTemplateTextContainer(htmlNodeIndex);
        const hoveredEditingTemplateTextBackground = hoveredEditingTemplateTextContainer ?
            getComputedStyle(hoveredEditingTemplateTextContainer).backgroundColor : null;

        this._moveArea = this._calculateMouseMoveArea(hoveredContainers);
        this._stylesContainer.innerHTML = this._getItemActionsOutsideFreezeStyles(this._uniqueClass, htmlNodeIndex);
        this._stylesContainer.innerHTML += this._getItemHoverFreezeStyles(
            this._uniqueClass,
            htmlNodeIndex,
            hoverBackgroundColor,
            hoveredEditingTemplateTextBackground);
        if (this._freezeHoverCallback) {
            this._freezeHoverCallback();
        }
    }

    /**
     * Получает из DOM первый контейнер с редактируемым полем в текущей записи.
     * Нам нужен только один контейнер, чтобы получить его фон
     * @param index
     * @private
     */
    private _getEditingTemplateTextContainer(index: number): HTMLElement {
        const editingTemplateTextSelector = this._getEditingTemplateTextSelector(this._uniqueClass, index);
        return this._viewContainer.querySelector(editingTemplateTextSelector);
    }

    /**
     * Получает из DOM контейнер текущей записи или контейнеры ячеек таблицы
     * @param index
     * @private
     */
    private _getHoveredItemContainers(index: number): NodeListOf<HTMLElement> {
        const hoveredContainerSelector = this._getItemHoveredContainerSelector(this._uniqueClass, index);
        return this._viewContainer.querySelectorAll(hoveredContainerSelector);
    }

    /**
     * Калькулятор зоны перемещения курсора внутри записи.
     * Вычисляет зону перемещения курсора как высоту и ширину записи + высота операций над записью
     * @param hoveredContainers
     * @private
     */
    private _calculateMouseMoveArea(hoveredContainers: NodeListOf<HTMLElement>): IMouseMoveArea {
        const lastContainer = hoveredContainers[hoveredContainers.length - 1];
        const itemActionsContainer = lastContainer.closest('.controls-ListView__itemV')
            .querySelector(ITEM_ACTIONS_CONTAINER_SELECTOR);
        const resultRect = {
            bottom: null,
            left: null,
            right: null,
            top: null
        };
        let itemActionsHeight = 0;
        if (itemActionsContainer) {
            itemActionsHeight = (itemActionsContainer as HTMLElement).offsetHeight;
        }
        hoveredContainers.forEach((container) => {
            const containerRect = container.getBoundingClientRect();
            const bottom = containerRect.top + containerRect.height + itemActionsHeight;
            if (resultRect.top === null) {
                resultRect.top = containerRect.top;
            }
            if (resultRect.bottom === null || resultRect.bottom < bottom) {
                resultRect.bottom = bottom;
            }
            if (resultRect.left === null) {
                resultRect.left = containerRect.left;
            }
            resultRect.right = containerRect.left + containerRect.width;
        });
        return resultRect;
    }

    /**
     * Селектор для выбора строки или ячеек
     * Необходим для определения реального размера строки в таблицах и в списках.
     * Также необходим для выбора фона строки под курсором
     * @param uniqueClass
     * @param index
     * @private
     */
    private _getItemHoveredContainerSelector(uniqueClass: string, index: number): string {
        return ` .${uniqueClass} .controls-ListView__itemV:nth-child(${index}) .${this._measurableContainerSelector}, ` +
               ` .${uniqueClass} .controls-ListView__itemV:nth-child(${index})`;
    }

    /**
     * Селектор для редактируемых полей внутри выделенной строки.
     * Позволяет выбрать фон для записи с редактируемыми полями, но которая ещё не переведена в режим редактирования.
     * @param uniqueClass
     * @param index
     * @private
     */
    private _getEditingTemplateTextSelector(uniqueClass: string, index: number): string {
        return `.${uniqueClass} .controls-ListView__itemV:nth-child(${index}):hover ${EDITABLE_HOVER_CONTAINER_SELECTOR}`;
    }

    /**
     * Стили для отключения hover в строке плоского списка или в ячейках строки таблицы
     * @param uniqueClass
     * @param index
     * @param hoverBackgroundColor
     * @param hoveredEditingTemplateTextBackground
     * @private
     */
    private _getItemHoverFreezeStyles(uniqueClass: string,
                                      index: number,
                                      hoverBackgroundColor: string,
                                      hoveredEditingTemplateTextBackground: string): string {
        let styles = `
              .${uniqueClass} .controls-ListView__itemV:not(:nth-child(${index})):hover,
              .${uniqueClass} .controls-ListView__itemV:not(:nth-child(${index})):hover ${ITEM_HOVER_CONTAINER_SELECTOR} {
                background-color: inherit;
              }
              .${uniqueClass} .controls-ListView__itemV:nth-child(${index}),
              .${uniqueClass} .controls-ListView__itemV:nth-child(${index}) ${ITEM_HOVER_CONTAINER_SELECTOR} {
                background-color: ${hoverBackgroundColor};
              }
              `;
        if (hoveredEditingTemplateTextBackground) {
            styles += `.${uniqueClass} .controls-ListView__itemV:nth-child(${index}) ${EDITABLE_HOVER_CONTAINER_SELECTOR} {
                background-color: ${hoveredEditingTemplateTextBackground};
            }`;
        }
        return styles;
    }

    private _getItemActionsOutsideFreezeStyles(uniqueClass: string, index: number): string {
        return `
              .${uniqueClass} .controls-ListView__itemV:nth-child(${index}) ${ITEM_ACTIONS_CONTAINER_SELECTOR} {
                 opacity: 1;
                 visibility: visible;
              }
              `;
    }
}
