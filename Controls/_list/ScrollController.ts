import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls/_list/ScrollController/ScrollController';
import {IObservable} from 'Types/collection';
import VirtualScroll from './ScrollController/VirtualScroll';
import {SyntheticEvent} from 'Vdom/Vdom';
import {detection} from 'Env/Env';
import scrollToElement = require('Controls/Utils/scrollToElement');
import InertialScrolling from './resources/utils/InertialScrolling';
import {CollectionItem} from 'Controls/display';
import {throttle} from 'Types/function';
import {Record as entityRecord, descriptor} from 'Types/entity';
import {IDirection, IVirtualPageSizeMode, IVirtualScrollMode} from './interface/IVirtualScroll';

interface IOptions extends IControlOptions {
    virtualPageSize: number;
    virtualSegmentSize: number;
    virtualScrollMode: IVirtualScrollMode;
    viewModel: unknown;
    useNewModel: boolean;
    virtualScrolling: boolean;
    scrollCalculation: boolean;
}

interface IScrollParams {
    scrollTop: number;
    clientHeight: number;
    scrollHeight: number;
}

const DEFAULT_TRIGGER_OFFSET = 100;
const SIZE_RELATION_TO_VIEWPORT = 0.3;

/**
 * Компонент управляющий скроллированием в списочных контролах
 * Нотифицирует о необходимости подгрузки данных
 * Управляет виртуальным скроллированием
 * @author Волоцкой В.Д.
 * @private
 * @control
 * @extends UI/Base:Control
 */
export default class ScrollController extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected virtualScroll: VirtualScroll;
    private itemsContainer: HTMLElement;
    private scrollRegistered: boolean = false;

    // Флаг фейкового скролла, необходим для корректного рассчета активного элемента
    private fakeScroll: boolean = false;

    // Сущность управляющая инерционным скроллингом на мобильных устройствах
    private inertialScrolling: InertialScrolling = new InertialScrolling();

    // Видимость триггеров загрузки
    private triggerVisibility: {
        up: boolean;
        down: boolean;
    } = {up: false, down: false};

    // Размер виртуальных распорок
    private placeholdersSizes: {
        top: number;
        bottom: number;
    } = {top: 0, bottom: 0};

    // Флаг того, что поменялся набор записей, необходим для пересчета высот
    private itemsChanged: boolean;

    // Таймаут для проверки необходимости дозагрузки данных
    private checkCapabilityTimeout: number;

    // Флаг и стейт для индикации необходимости сохранения позиции скролла и его направления
    private saveScrollPosition: boolean;
    private savedScrollDirection: IDirection;

    // Предыдущие индексы отображаемых записей
    private savedStopIndex: number = 0;
    private savedStartIndex: number = 0;

    // Актуальные индексы отображаемых записей
    private actualStartIndex: number = 0;
    private actualStopIndex: number = 0;

    // Стейт, хранящий ссылку на модель, нужен для сохранения индексов на _beforeMount, так как во время выполнения
    // _beforeMount модель не лежит в _options
    private viewModel: unknown;

    // Коллбек, который нужно выполнить на следующую перерисовку
    private afterRenderCallback: Function;

    // Коллбек, восстававливающий позицию скролла
    private applyScrollTopCallback: Function;

    // Оффсеты загрузочных триггеров
    protected topTriggerOffset: number = DEFAULT_TRIGGER_OFFSET;
    protected bottomTriggerOffset: number = DEFAULT_TRIGGER_OFFSET;
    private __mounted: boolean;
    itemsFromLoadToDirection: boolean = false;

    protected _beforeMount(options: IOptions): void {
        if (options.virtualScrolling) {
            this.virtualScroll = new VirtualScroll({
                pageSize: options.virtualPageSize,
                segmentSize: options.virtualSegmentSize,
                virtualScrollMode: options.virtualScrollMode,
                placeholderChangedCallback: this.placeholdersChangedCallback,
                indexesChangedCallback: this.indexesChangedCallback,
                loadMoreCallback: this.loadMoreCallback
            });
            this.virtualScroll.triggerOffset = this.topTriggerOffset;
            this.initModel(options.viewModel, options.useNewModel);
            this.reset(this.viewModel.getCount());
        }
    }

    protected _afterMount(): void {
        this.__mounted = true;

        if (this._options.scrollCalculation) {
            this.registerScroll();
        }
    }

    protected _beforeUpdate(options: IOptions): void {
        if (this._options.viewModel !== options.viewModel) {
            this.initModel(options.viewModel, options.useNewModel);
        }

        if (this._options.scrollCalculation) {
            this.registerScroll();
        }
    }

    protected _beforeRender(): void {
        if (this.saveScrollPosition) {
            this._notify('saveScrollPosition', [], {bubbling: true});
        }
    }

    protected _afterRender(): void {
        if (this.virtualScroll && this.virtualScroll.itemsContainer && this.itemsChanged) {
            this.virtualScroll.recalcItemsHeights();
            this.itemsChanged = false;
        }

        this.updateShadowMode();

        if (this.virtualScroll && this.applyScrollTopCallback) {
            this.applyScrollTopCallback();
            this.applyScrollTopCallback = null;

            this.checkCapabilityTimeout = setTimeout(() => {
                this.checkCapability();
                clearTimeout(this.checkCapabilityTimeout);
            });
        }

        if (this.afterRenderCallback) {
            this.afterRenderCallback();
            this.afterRenderCallback = null;
        }

        if (this.saveScrollPosition) {
            if (this.savedScrollDirection) {
                this.scrollToPosition(this.savedScrollDirection === 'up' ?
                    this.virtualScroll.scrollTop + this.virtualScroll.getItemsHeights(this.actualStartIndex, this.savedStartIndex) :
                    this.virtualScroll.scrollTop - this.virtualScroll.getItemsHeights(this.savedStartIndex, this.actualStartIndex)
                );
            }
            this.savedStartIndex = this.actualStartIndex;
            this.savedStopIndex = this.actualStopIndex;
            this.saveScrollPosition = false;
            this.savedScrollDirection = null;
            this.checkCapabilityTimeout = setTimeout(() => {
                this.checkCapability();
                clearTimeout(this.checkCapabilityTimeout);
            });
        }
    }

    protected _beforeUnmount(): void {
        clearTimeout(this.checkCapabilityTimeout);
    }

    protected itemsContainerReadyHandler(_: SyntheticEvent<Event>, itemsContainer: HTMLElement): void {
        if (this._options.virtualScrolling) {
            this.virtualScroll.itemsContainer = itemsContainer;
        }

        this.itemsContainer = itemsContainer;
    }

    /**
     * Обновление режима тени, в зависимости от размеров виртуальных распорок
     * @remark Так как при виртуальном скроллировании отображается только некоторый "видимый" набор записей
     * то scrollContainer будет неверно рассчитывать наличие тени, поэтому управляем режимом тени вручную
     */
    private updateShadowMode(): void {
        this._notify('updateShadowMode', [this.placeholdersSizes]);
    }

    /**
     * Инициализация модели и подписка на ее изменения
     * @param {unknown} model
     * @param {boolean} useNewModel
     */
    private initModel(model: unknown, useNewModel: boolean): void {
        this.viewModel = model;

        if (useNewModel) {
            model.subscribe('onCollectionChange', (...args: unknown[]) => {
                this.collectionChangedHandler.apply(this, [args[0], null, ...args.slice(1)]);
            });
        } else {
            model.subscribe('onListChange', this.collectionChangedHandler);
        }
    }

    /**
     * Обработчик смены данных в модели
     * @param {string} event
     * @param {string} changesType
     * @param {string} action
     * @param {CollectionItem<entityRecord>[]} newItems
     * @param {number} newItemsIndex
     * @param {CollectionItem<entityRecord>[]} removedItems
     * @param {number} removedItemsIndex
     */
    private collectionChangedHandler = (event: string, changesType: string, action: string, newItems: CollectionItem<entityRecord>[],
                                        newItemsIndex: number, removedItems: CollectionItem<entityRecord>[], removedItemsIndex: number): void => {
        const newModelChanged = this._options.useNewModel && action && action !== IObservable.ACTION_CHANGE;

        if (this.virtualScroll && (changesType === 'collectionChanged' || newModelChanged) && action) {
            const newCount = this._options.viewModel.getCount();
            this.virtualScroll.itemsCount = newCount;

            if (action === IObservable.ACTION_ADD || action === IObservable.ACTION_MOVE) {
                this.virtualScroll.insertItemsHeights(newItemsIndex, newItems.length);

                // Обновляем виртуальный скроллинг, только если он инициализирован, так как в другом случае,
                // мы уже не можем на него повлиять
                if (this.virtualScroll && this.virtualScroll.itemsContainer) {
                    const direction = newItemsIndex <= this._options.viewModel.getStartIndex() ? 'up' : 'down';

                    if (direction === 'down') {
                        if (this.actualStopIndex === newCount - newItems.length && this.triggerVisibility.down && !this.itemsFromLoadToDirection) {
                            this.virtualScroll.recalcToDirection(direction);
                        } else {
                            this.virtualScroll.recalcFromNewItems(direction);
                        }
                    } else {
                        if (this.itemsFromLoadToDirection) {
                            this.savedStopIndex += newItems.length;
                            this.savedStartIndex += newItems.length;
                            this.virtualScroll.setStartIndex(this.actualStartIndex + newItems.length);
                        }
                        this.virtualScroll.recalcFromNewItems(direction);
                    }

                    this.saveScrollPosition = true;
                    this.savedScrollDirection = direction;
                }
            }

            if (action === IObservable.ACTION_REMOVE || action === IObservable.ACTION_MOVE) {
                this.virtualScroll.cutItemsHeights(removedItemsIndex, removedItems.length);

                // Сдвигаем виртуальный скролл только если он уже проинициализирован. Если коллекция
                // изменилась после создания BaseControl'a, но до инициализации скролла, (или сразу
                // после уничтожения BaseControl), сдвинуть его мы все равно не можем.
                if (this.virtualScroll && this.virtualScroll.itemsContainer) {
                    this.virtualScroll.recalcFromNewItems(
                        removedItemsIndex < this._options.viewModel.getStartIndex() ? 'up' : 'down'
                    );
                }
            }
        }

        if (changesType === 'collectionChanged' || changesType === 'indexesChanged' || newModelChanged) {
            this.itemsChanged = true;
        }

        this._forceUpdate();
    }

    protected viewResizeHandler(): void {
        if (this.__mounted && this.virtualScroll) {
            this.virtualScroll.recalcItemsHeights();
        }
    }

    protected virtualScrollMoveHandler(params): void {
        if (this.virtualScroll) {
            this.applyScrollTopCallback = params.applyScrollTopCallback;
            this.throttledUpdateIndexesByVirtualScrollMove(params);
        }
    }

    /**
     * Обработчик изменения позиции "виртуального" скролла
     * @type {Function}
     * @remark Для повышения производительности используем throttle, чтобы не вызывать пересчет "видимого" набора
     * данных слишком часто
     */
    protected throttledUpdateIndexesByVirtualScrollMove = throttle((params) => {
        this.virtualScroll.scrollTop = params.scrollTop;
        this.virtualScroll.recalcFromScrollTop();
    }, 150, true);

    protected emitListScrollHandler(event: SyntheticEvent<Event>, type: string, params: IScrollParams | unknown[]): void {
        switch (type) {
            case 'virtualPageTopStart':
                this.updateViewWindow('up', params as IScrollParams);
                break;
            case 'virtualPageTopStop':
                this.changeTriggerVisibility('up', false);
                break;
            case 'virtualPageBottomStart':
                this.updateViewWindow('down', params as IScrollParams);
                break;
            case 'virtualPageBottomStop':
                this.changeTriggerVisibility('down', false);
                break;
            case 'scrollMoveSync':
                this.handleListScrollSync(params as IScrollParams);
                break;
            case 'viewportRize':
                this.updateViewport(params[0]);
                break;
            case 'virtualScrollMove':
                this.virtualScrollMoveHandler(params);
                break;
            case 'canScroll':
                this.updateViewport(params.clientHeight, false);
                this.proxyEvent(type, params as IScrollParams);
                break;
            case 'scrollResize':
            case 'scrollMove':
            case 'cantScroll':
                this.proxyEvent(type, params as IScrollParams);
                break;
        }
    }

    /**
     * Функция подскролла к элементу
     * @param {string | number} key
     * @remark Функция подскролливает к записи, если это возможно, в противном случае вызовется перестроение
     * от элемента
     */
    scrollToItem(key: string|number, toBottom?: boolean): void {
        let itemIndex = this._options.viewModel.getIndexByKey(key);

        if (itemIndex !== -1) {
            if (this._options.virtualScrolling) {
                const callback = () => {
                    this.scrollToPosition(this.virtualScroll.getItemOffset(itemIndex));
                };
                if (this.virtualScroll.canScrollToItem(itemIndex)) {
                    callback();
                } else {
                    this.virtualScroll.recalcFromIndex(itemIndex);
                    this.afterRenderCallback = callback;
                }
            } else {
                const container = this.itemsContainer.children[itemIndex];

                if (container) {
                    this.scrollToElement(container as HTMLElement);
                }
            }
        }
    }

    /**
     * Функция обнуляет текущий виртуальный скроллинг
     * @param {number} itemsCount
     */
    reset(itemsCount: number): void {
        if (this.virtualScroll) {
            this.itemsChanged = true;
            this.virtualScroll.itemsCount = itemsCount;
            this.virtualScroll.reset();
        }
    }

    /**
     * Проверка на видимость триггеров
     * @remark Иногда, уже после загрузки данных триггер остается видимым, в таком случае вызвать повторную загрузку
     * данных
     */
    checkCapability(): void {
        if (!this.applyScrollTopCallback) {
            if (this.triggerVisibility.up) {
                this.updateViewWindow('up');
            }

            if (this.triggerVisibility.down) {
                this.updateViewWindow('down');
            }
        }

    }

    private scrollToPosition(position: number): void {
        this.fakeScroll = true;
        this._notify('restoreScrollPosition', [ position ], {bubbling: true});
        this.fakeScroll = false;
    }

    /**
     * Подскролливает к переданному HTML-элементу
     * @param {HTMLElement} container
     */
    private scrollToElement(container: HTMLElement): void {
        scrollToElement(container, false);
    }

    private updateViewport(viewportHeight: number, shouldNotify: boolean = true): void {
        if (this._options.virtualScrolling) {
            this.virtualScroll.viewportHeight = viewportHeight;
            this.virtualScroll.triggerOffset =
                this.bottomTriggerOffset = this.topTriggerOffset = SIZE_RELATION_TO_VIEWPORT * viewportHeight;
            this._notify('triggerOffsetChanged', [this.topTriggerOffset, this.bottomTriggerOffset]);
        }

        if (shouldNotify) {
            this.proxyEvent('viewPortResize', [viewportHeight]);
        }
    }

    private handleListScrollSync(params: IScrollParams): void {
        if (detection.isMobileIOS) {
            this.inertialScrolling.scrollStarted();
        }

        if (this._options.virtualScrolling) {
            this.virtualScroll.scrollTop = params.scrollTop;
            this.virtualScroll.viewportHeight = params.clientHeight;
            this.virtualScroll.itemsContainerHeight = params.scrollHeight;

            if (!this.afterRenderCallback && !this.fakeScroll) {
                const activeIndex = this.virtualScroll.getActiveElement();

                if (typeof activeIndex !== 'undefined') {
                    this._notify('activeElementChanged', [
                        this._options.viewModel.at(activeIndex).getUid()
                    ]);
                }
            }
        }

        this.proxyEvent('scrollMoveSync', [params]);
    }

    private proxyEvent(type: string, params: unknown): void {
        this._notify(type, [params]);
    }

    private changeTriggerVisibility(direction: IDirection, state: boolean): void {
        this.triggerVisibility[direction] = state;
        this._notify('triggerVisibilityChanged', [direction, state]);
    }

    /**
     * Обновляет "видимый" набор данных
     * @param {"up" | "down"} direction
     * @param {unknown} params
     * @remark Если виртуальный скроллинг отключен, то вызывает подгрузку данных
     */
    private updateViewWindow(direction: IDirection, params?: IScrollParams): void {
        this.changeTriggerVisibility(direction, true);
        if (this._options.virtualScrolling) {
            if (params) {
                this.virtualScroll.viewportHeight = params.clientHeight;
            }

            this.inertialScrolling.callAfterScrollStopped(() => {
                this.virtualScroll.recalcToDirection(direction);
            });
        } else {
            this._notify('loadMore', [direction]);
        }
    }

    private loadMoreCallback = (direction: IDirection): void => {
        this._notify('loadMore', [direction]);
    }

    private placeholdersChangedCallback = ([top, bottom]: [number, number]): void => {
        if (this.__mounted) {
            this._notify('updatePlaceholdersSize', [{top, bottom}], {bubbling: true});
            this.placeholdersSizes = {top, bottom};
        }
    }

    private indexesChangedCallback = (startIndex: number, stopIndex: number, direction?: IDirection): void => {
        // Пересчет активных элементов
        const model = this.viewModel;
        this.actualStartIndex = startIndex;
        this.actualStopIndex = stopIndex;

        if (this.applyIndexesToModel(model, startIndex, stopIndex)) {
            if (direction) {
                this.savedScrollDirection = direction;
            }

            this.saveScrollPosition = true;
            this.itemsChanged = true;
        } else if (this.applyScrollTopCallback) {
            this.applyScrollTopCallback();
            this.applyScrollTopCallback = null;
        }
    }

    /**
     * Применяет "видимый" набор в модель
     * @param {unknown} model
     * @param {number} startIndex
     * @param {number} stopIndex
     * @returns {boolean}
     */
    private applyIndexesToModel(model: unknown, startIndex: number, stopIndex: number): boolean {
        if (model.setViewIndices) {
            return model.setViewIndices(startIndex, stopIndex);
        } else {
            return model.setIndexes(startIndex, stopIndex);
        }
    }

    private registerScroll(): void {
        if (!this.scrollRegistered) {
            this._children.scrollEmitter.startRegister(this._children);
            this.scrollRegistered = true;
        }
    }

    static getDefaultOptions(): Partial<IOptions> {
        return {
            virtualPageSize: 100
        };
    }

    static getOptionTypes(): Record<string, Function> {
        return {
            virtualSegmentSize: descriptor(Number),
            virtualPageSize: descriptor(Number)
        }
    }
}
