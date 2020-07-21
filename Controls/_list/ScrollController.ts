import {IControlOptions} from 'UI/Base';
import {Collection} from 'Controls/display';
import VirtualScroll from './ScrollContainer/VirtualScroll';
import {Record} from 'Types/entity';
import {IObservable} from 'Types/collection';
import {
    IItemsHeights,
    IPlaceholders,
    IRange,
    IDirection,
    ITriggerState,
    IContainerHeights,
    IScrollRestoreParams
} from './ScrollContainer/interfaces';
import InertialScrolling from './resources/utils/InertialScrolling';
import {detection} from 'Env/Env';
import {throttle} from 'Types/function';
import {VirtualScrollHideController, VirtualScrollController} from 'Controls/display';
import { getElementByKey } from 'Controls/_list/ScrollContainer/GetHeights';


export interface IScrollParams {
    clientHeight: number;
    scrollTop: number;
    scrollHeight: number;
    rect?: DOMRect;
    applyScrollTopCallback?: Function;
}

interface ICompatibilityOptions {
    useNewModel: boolean;
}
type TRecalcToDirectionResult = 'INDICATOR_UP' | 'INDICATOR_DOWN' | 'LOAD_MORE';
export interface IOptions extends IControlOptions, ICompatibilityOptions {
    virtualScrollConfig: {
        pageSize?: number;
        segmentSize?: number;
        mode?: 'remove' | 'hide';
        itemHeightProperty?: string;
        viewportHeight?: number;
    };
    attachLoadTopTriggerToNull: boolean;
    needScrollCalculation: boolean;
    collection: Collection<Record>;
    activeElement: string | number;
    _triggerPositionCoefficient: number;
    _notify: (eventName: string, args?: unknown[], options?: { bubbling?: boolean }) => unknown;
    forceInitVirtualScroll: boolean;
}

/**
 * Контейнер управляющий операциями скролла в списке.
 * @class Controls/_list/ScrollController/ScrollController
 * @control
 * @private
 * @author Авраменко А.С.
 */
export default class ScrollController {

    // В браузерах кроме хрома иногда возникает ситуация, что смена видимости триггера срабатывает с задержкой
    // вследствие чего получаем ошибку в вычислениях нового range и вообше делаем по сути
    // лишние пересчеты, например: https://online.sbis.ru/opendoc.html?guid=ea354034-fd77-4461-a368-1a8019fcb0d4
    // TODO: этот код должен быть убран после
    // https://online.sbis.ru/opendoc.html?guid=702070d4-b401-4fa6-b457-47287e44e0f4
    private get _calculatedTriggerVisibility(): ITriggerState {
        const topTriggerOffset =
            this._getTopTriggerOffset(this._triggerOffset, this._options.attachLoadTopTriggerToNull);
        return {
            up: topTriggerOffset >= this._lastScrollTop - this._container.offsetTop,
            down: this._lastScrollTop + this._viewportHeight >= this._viewHeight - this._triggerOffset
        };
    }

    private _container: HTMLElement;
    private _virtualScroll: VirtualScroll;

    private _viewHeight: number = 0;
    private _viewportHeight: number = 0;
    private _triggerOffset: number = 0;
    private _lastScrollTop: number = 0;

    private _triggerVisibility: ITriggerState = {up: false, down: false};

    private _restoreScrollResolve: Function;

    private _afterRenderCallbacks: Function[];
    private _isRendering: boolean = false;

    private _indicatorState: IDirection;

    // Флаг, который необходимо включать, чтобы не реагировать на скроллы происходящие вследствие
    // подскроллов создаваемых самим контролом (scrollToItem, восстановление позиции скролла после перерисовок)
    private _fakeScroll: boolean;

    private _isMounted: boolean = false;

    // Сущность управляющая инерционным скроллингом на мобильных устройствах
    private _inertialScrolling: InertialScrolling = new InertialScrolling();

    protected _options: any;

    private _callbacks: any;

    private _throttledPositionChanged: Function = throttle((params) => {
        
    }, SCROLLMOVE_DELAY, true);

    constructor(options: any) {
        this._options = {...ScrollController.getDefaultOptions(), ...options};
        if (options.needScrollCalculation) {
            this._initModelObserving(options);
        }
        this._initVirtualScroll(options);
        this._callbacks = options.callbacks;
    }


    afterMount(container: HTMLElement): void {
        this._isMounted = true;
        this._setContainer(container);
        if (this._container) {
            this._afterRenderHandler();
        }
    }
    update(params: Partial<IScrollParams>): void {
        if (this._virtualScroll) {
            let newParams: Partial<IContainerHeights> = {trigger: this._triggerOffset};
            if (params.clientHeight) {
                newParams.viewport = params.clientHeight;
                this._viewportHeight = params.clientHeight;
            }
            if (params.scrollHeight) {
                newParams.scroll = params.scrollHeight;
                this._viewHeight = params.scrollHeight;
            }
            this._virtualScroll.applyContainerHeightsData(newParams);
        }
    }
    updateOptions(options: IOptions): void {
        if (options.collection && this._options.collection !== options.collection) {
            if (options.needScrollCalculation) {
                this._initModelObserving(options);
            }
            this._initVirtualScroll(options);
            this._options.collection = options.collection;
        }

       
        if (options.activeElement) {
            this._options.activeElement = options.activeElement;
        }
        if (this._options.attachLoadTopTriggerToNull !== options.attachLoadTopTriggerToNull) {
            this._options.attachLoadTopTriggerToNull = options.attachLoadTopTriggerToNull;
        }
        this._isRendering = true;
    }

    needToSaveAndRestoreScrollPosition(): boolean {
        return !!(this._virtualScroll && this._virtualScroll.isNeedToRestorePosition);
    }

    afterRender(): boolean {
        this._isRendering = false;
        return this._afterRenderHandler();
    }

    reset(): void {
        
    }

    /**
     * Функция подскролла к элементу
     * @param {string | number} key
     * @param {boolean} toBottom
     * @param {boolean} force
     * @remark Функция подскролливает к записи, если это возможно, в противном случае вызовется перестроение
     * от элемента
     */
    scrollToItem(key: string | number, toBottom: boolean = true, force: boolean = false, scrollCallback): Promise<void> {
        const index = this._options.collection.getIndexByKey(key);

        if (index !== -1) {
            return new Promise((resolve) => {

                if (this._virtualScroll && this._virtualScroll.canScrollToItem(index, toBottom, force)) {
                    this._fakeScroll = true;
                    scrollCallback(index);
                    resolve();
                } else if (force) {
                    this._inertialScrolling.callAfterScrollStopped(() => {
                        if (this._virtualScroll && this._virtualScroll.rangeChanged) {
                            // Нельзя менять диапазон отображемых элементов во время перерисовки
                            // поэтому нужно перенести scrollToItem на следующий цикл синхронизации (после отрисовки)
                            // Для этого используем _scrollToItemAfterRender.
                            // https://online.sbis.ru/opendoc.html?guid=2a97761f-e25a-4a10-9735-ded67e36e527
                            this.doAfterRender(() => {
                                this.scrollToItem(key, toBottom, force, scrollCallback).then(resolve);
                            });
                        } else {
                            this.doAfterRender(() => {
                                if (this._virtualScroll) {
                                    const rangeShiftResult = this._virtualScroll.resetRange(
                                        index,
                                        this._options.collection.getCount()
                                    );
                                    this._notifyPlaceholdersChanged(rangeShiftResult.placeholders);
                                    this._setCollectionIndices(
                                        this._options.collection,
                                        rangeShiftResult.range,
                                        false,
                                        this._options.needScrollCalculation
                                    );

                                    // Скролл нужно восстанавливать после отрисовки, для этого используем
                                    // _restoreScrollResolve
                                    this._restoreScrollResolve = () => {
                                        this._fakeScroll = true;
                                        scrollCallback(index);
                                        resolve();
                                    }
                                }
                            });
                        }
                    });
                } else {
                    resolve();
                }
            });
        } else {
            return Promise.resolve();
        }
    }

    isTriggerVisible(direction: IDirection): boolean {
        return !this._afterRenderCallbacks && !this._container.closest('.ws-hidden') && this._calculatedTriggerVisibility[direction];
    }
    private _initModelObserving(options: IOptions): void {
        if (options.collection) {
           
            if (options.useNewModel) {
                ScrollController._setCollectionIterator(options.collection, options.virtualScrollConfig.mode);
            }
        }
    }

    private _initVirtualScroll(options: IOptions, count?: number): IPlaceholders {
        const virtualScrollConfig = options.virtualScrollConfig || {};
        if (options.collection && (
            !virtualScrollConfig.pageSize ||
            options.collection.getCount() >= virtualScrollConfig.pageSize ||
            options.forceInitVirtualScroll ||
            this._virtualScroll
        )) {
            this._virtualScroll = new VirtualScroll(
                options.virtualScrollConfig || {},
                {
                    viewport: this._viewportHeight,
                    scroll: this._viewHeight,
                    trigger: this._triggerOffset
                });

            let itemsHeights: Partial<IItemsHeights>;

            const initialIndex = typeof options.activeElement !== 'undefined' ?
                options.collection.getIndexByKey(options.activeElement) : 0;

            if (options?.virtualScrollConfig?.itemHeightProperty) {
                this._virtualScroll.applyContainerHeightsData({
                    viewport: options.virtualScrollConfig.viewportHeight
                });

                itemsHeights = {
                    itemsHeights: []
                };

                options.collection.each((item, index) => {
                    itemsHeights.itemsHeights[index] = item
                        .getContents()
                        .get(options.virtualScrollConfig.itemHeightProperty);
                });
            }

            const rangeShiftResult = this._virtualScroll.resetRange(
                initialIndex,
                count === undefined ?  options.collection.getCount() : count,
                itemsHeights
            );
            this._setCollectionIndices(
                options.collection,
                rangeShiftResult.range,
                true,
                options.needScrollCalculation
            );

            if (options.activeElement) {
                this._restoreScrollResolve = () => {
                    this.scrollToItem(options.activeElement, false, true);
                };
            }
            return rangeShiftResult.placeholders;
        }
    }


    private _setCollectionIndices(
        collection: Collection<Record>,
        {start, stop}: IRange,
        force?: boolean,
        needScrollCalculation?: boolean
    ): void {
        if (needScrollCalculation) {
            let collectionStartIndex: number;
            let collectionStopIndex: number;

            if (collection.getViewIterator) {
                collectionStartIndex = VirtualScrollController.getStartIndex(
                    collection as unknown as VirtualScrollController.IVirtualScrollCollection
                );
                collectionStopIndex = VirtualScrollController.getStopIndex(
                    collection as unknown as VirtualScrollController.IVirtualScrollCollection
                );
            } else {
                // @ts-ignore
                collectionStartIndex = collection.getStartIndex();
                // @ts-ignore
                collectionStopIndex = collection.getStopIndex();
            }

            if (collectionStartIndex !== start || collectionStopIndex !== stop || force) {
                if (collection.getViewIterator) {
                    collection.getViewIterator().setIndices(start, stop);
                } else {
                    // @ts-ignore
                    collection.setIndexes(start, stop);
                }
            }
        }
    }

    /**
     * Обработчик на событие смены видимости триггера
     * @param triggerName
     * @param triggerVisible
     */
    triggerVisibilityChanged(triggerName: IDirection, triggerVisible: boolean): void {
        this._triggerVisibility[triggerName] = triggerVisible;
    }

    /**
     * Обработчик на событие скролла
     */
    scrollPositionChanged(params: IScrollParams): string | number {
        this._lastScrollTop = params.scrollTop;

        if (detection.isMobileIOS) {
            this._inertialScrolling.scrollStarted();
        }

        if (this._fakeScroll) {
            this._fakeScroll = false;
        } else if (!this._restoreScrollResolve && this._virtualScroll && !this._virtualScroll.rangeChanged) {
            const activeIndex = this._virtualScroll.getActiveElementIndex(this._lastScrollTop);

            if (typeof activeIndex !== 'undefined') {
                const activeElement = this._options.collection.at(activeIndex).getUid();

                if (activeElement !== this._options.activeElement) {
                    return activeElement;
                }
            }
        }
    }

    /**
     * Обработчик передвижения скроллбара
     * @param params
     * @private
     */
    scrollBarPositionChanged(params: IScrollParams): IPlaceholders {
        if (this._virtualScroll) {
            const rangeShiftResult = this._virtualScroll.shiftRangeToScrollPosition(params.scrollTop);
            this._setCollectionIndices(this._options.collection, rangeShiftResult.range, false,
                this._options.needScrollCalculation);
            this.doAfterRender(params.applyScrollTopCallback);
            return rangeShiftResult.placeholders;
        }
    }

    /**
     * Производит пересчет диапазона в переданную сторону
     * @param direction
     * @private
     */
    recalcToDirection(direction: IDirection): TRecalcToDirectionResult {
        if (
            !this._virtualScroll ||
            this._virtualScroll &&
            !this._virtualScroll.rangeChanged &&
            this._virtualScroll.isRangeOnEdge(direction) ||
            !this._virtualScroll && this._options.virtualScrollConfig &&
            this._options.virtualScrollConfig.pageSize > this._options.collection.getCount()
        ) {
            return 'LOAD_MORE';
        } else {
            if (this._virtualScroll && !this._virtualScroll.rangeChanged) {
                this._inertialScrolling.callAfterScrollStopped(() => {
                    const rangeShiftResult = this._virtualScroll.shiftRange(direction);
                    this._notifyPlaceholdersChanged(rangeShiftResult.placeholders);
                    this._setCollectionIndices(this._options.collection, rangeShiftResult.range, false,
                        this._options.needScrollCalculation);
                    this._indicatorState = direction;
                });
                return direction === 'up' ? 'INDICATOR_UP' : 'INDICATOR_DOWN';
            }
        }
    }
    getIndicatorState(): IDirection {
        return this._indicatorState;
    }
    
    updateItemsHeights(itemsHeights: IItemsHeights) {
        this._virtualScroll.updateItemsHeights(itemsHeights);
    }
    needSetItemsHeights(): boolean {
        return !!(this._virtualScroll && this._virtualScroll.rangeChanged);
    }
    
    private _afterRenderHandler(): boolean {
        
        let needCheckTriggers = false;
        if (this._restoreScrollResolve) {
            this._restoreScrollResolve();
            this._restoreScrollResolve = null;

            needCheckTriggers = true;
        }

        if (this._afterRenderCallbacks) {
            this._afterRenderCallbacks.forEach((callback) => callback());
            this._afterRenderCallbacks = null;
            needCheckTriggers = true;
        }
        return needCheckTriggers;
    }

    /**
     * Вызывает callback вне апдейта
     * @param callback
     * @private
     * @remark Так как во время перерисовки нелья модифицировать стейт, нужно использовать данный метод для методов,
     * которые могут вызваться в произвольный момент времени
     */
    doAfterRender(callback: Function): void {
        if (this._isRendering) {
            if (this._afterRenderCallbacks) {
                this._afterRenderCallbacks.push(callback);
            } else {
                this._afterRenderCallbacks = [callback];
            }
        } else {
            callback();
        }
    }

    /**
     * Получает параметры для восстановления скролла
     */
    getParamsToRestoreScroll(): IScrollRestoreParams {
        return  this._virtualScroll.getParamsToRestoreScroll();
    }

    //TODO: Проверить актуальность костыля
    private setIndicesAfterCollectionChange() {
        
            // TODO Уберется после https://online.sbis.ru/opendoc.html?guid=5ebdec7d-e95e-438d-94f8-079a17b323c6
            // На данный момент индексы в модели проставляются в двух местах: здесь и на уровне модели
            // Вследствие чего могут возникать коллизии и индексы проставленные здесь, могут быть перетерты моделью.
            // Такое происходит например при добавлении в узел дерева
            // После решения ошибки этот код будет не нужен и индексы проставляться будут только здесь
            // @ts-ignore
            if (this._virtualScroll) {
                this._setCollectionIndices(
                    this._options.collection,
                    this._virtualScroll._range,
                    false,
                    this._options.needScrollCalculation
                );
            }
    }
    /**
     * Обработатывает добавление элементов в коллекцию
     * @param addIndex
     * @param items
     * @param direction направление добавления
     * @private
     */
    addItems(addIndex: number, items: object[], direction?: IDirection): IPlaceholders {
        if (!this._virtualScroll) {
            this._initVirtualScroll(
                {...this._options, forceInitVirtualScroll: true},
                (this._options.collection.getCount() - items.length)
            );
        }
        
        const rangeShiftResult = this._virtualScroll.addItems(
            addIndex,
            items.length,
            this._triggerVisibility,
            direction
        );
        
        this._setCollectionIndices(this._options.collection, rangeShiftResult.range, false,
            this._options.needScrollCalculation);
        this.setIndicesAfterCollectionChange();
        return rangeShiftResult.placeholders;
    }
    
    /**
     * Обрабатывает удаление элементов из коллекции
     * @param removeIndex
     * @param items
     * @param forcedShift
     * @private
     */
    removeItems(removeIndex: number, items: object[], forcedShift: boolean): IPlaceholders {
        if (this._virtualScroll) {
            const rangeShiftResult = this._virtualScroll.removeItems(removeIndex, items.length, forcedShift);
            this._setCollectionIndices(this._options.collection, rangeShiftResult.range, false,
                this._options.needScrollCalculation);
            this.setIndicesAfterCollectionChange();
            return rangeShiftResult.placeholders;
        }
    }

    resetItems(): IPlaceholders {
        let placeholders = this._initVirtualScroll(this._options);
        this.setIndicesAfterCollectionChange();
        return placeholders;
    }

    // TODO см. _notifyPlaceholdersChanged
    _notify(eventName: string, args?: any[], options?: { bubbling?: boolean }): any {
        this._options.notify(eventName, args, options);
    }

    // TODO
    // Не получается преобразовать вызовы этого метода в вызовы из BaseControl'а методов, возвращающих значения.
    // Там, где это возможно, заменил на возврат значения placeholders. 
    // Остались места, где этот метод вызывается в асинхронном порядке.
    private _notifyPlaceholdersChanged(placeholders: IPlaceholders): void {
        if (this._isMounted) {
            this._notify('updatePlaceholdersSize', [placeholders], {bubbling: true});
        }
    }

    private _getTopTriggerOffset(triggerOffset: number, attachLoadTopTriggerToNull: boolean): number {
        return attachLoadTopTriggerToNull ? 0 : triggerOffset;
    }

    getTriggerOffset(scrollHeight: number, viewportHeight: number): {top: number, bottom: number} {
        this._triggerOffset =
            (scrollHeight && viewportHeight ? Math.min(scrollHeight, viewportHeight) : 0) *
            this._options._triggerPositionCoefficient;
        const topTriggerOffset =
            this._getTopTriggerOffset(this._triggerOffset, this._options.attachLoadTopTriggerToNull);
        return {top: topTriggerOffset, bottom: this._triggerOffset};
    }

    private static _setCollectionIterator(collection: Collection<Record>, mode: 'remove' | 'hide'): void {
        switch (mode) {
            case 'hide':
                VirtualScrollHideController.setup(
                    collection as unknown as VirtualScrollHideController.IVirtualScrollHideCollection
                );
                break;
            default:
                VirtualScrollController.setup(
                    collection as unknown as VirtualScrollController.IVirtualScrollCollection
                );
                break;
        }
    }

    // TODO: из-за ошибки, что intersectionObserver не всегда вовремя сообщает актуальное состояние, 
    // приходится самим иногда понимать, виден ли триггер. Для этого нужен container.
    private _setContainer(container: HTMLElement) {
        let scrollContainer = container.getElementsByClassName('controls-ScrollController');
        this._container = <HTMLElement>scrollContainer[0];
    }

    static getDefaultOptions(): Partial<IOptions> {
        return {
            virtualScrollConfig: {
                mode: 'remove'
            },
            _triggerPositionCoefficient: 0.3
        };
    }
}
