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
    IScrollRestoreParams,
    IScrollControllerResult
} from './ScrollContainer/interfaces';
import InertialScrolling from './resources/utils/InertialScrolling';
import {detection} from 'Env/Env';
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
type TShiftToDirectionResult = 'SHIFTING' | 'CANT_SHIFT';
export interface IOptions extends IControlOptions, ICompatibilityOptions {
    virtualScrollConfig: {
        pageSize?: number;
        segmentSize?: number;
        mode?: 'remove' | 'hide';
        itemHeightProperty?: string;
        viewportHeight?: number;
    };
    needScrollCalculation: boolean;
    collection: Collection<Record>;
    activeElement: string | number;
    _triggerPositionCoefficient: number;
    _notify: (eventName: string, args?: unknown[], options?: { bubbling?: boolean }) => unknown;
    forceInitVirtualScroll: boolean;
    attachLoadTopTriggerToNull: boolean;
}

/**
 * Контейнер управляющий операциями скролла в списке.
 * @class Controls/_list/ScrollController/ScrollController
 * @control
 * @private
 * @author Авраменко А.С.
 */
export default class ScrollController {

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

    // Сущность управляющая инерционным скроллингом на мобильных устройствах
    private _inertialScrolling: InertialScrolling = new InertialScrolling();

    private _changedPlaceholders: IPlaceholders;

    protected _options: any;

    constructor(options: any) {
        this._options = {...ScrollController.getDefaultOptions(), ...options};
        if (options.needScrollCalculation) {
            if (options.useNewModel) {
                ScrollController._setCollectionIterator(options.collection, options.virtualScrollConfig.mode);
            }
        }
        this._initVirtualScroll(options);
    }

    private getResult(result: IScrollControllerResult) {
        return {placeholders: this._changedPlaceholders, ...result}
    }

    updateScrollParams(params: Partial<IScrollParams>):  IScrollControllerResult {
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
            return  this.getResult({
                triggerOffset: this.getTriggerOffset(this._viewHeight, 
                                                     this._viewportHeight, 
                                                     this._options.attachLoadTopTriggerToNull)});
        }
    }

    update(options: IOptions, params: Partial<IScrollParams>): IScrollControllerResult {
        if (options.collection && (
            this._options.collection !== options.collection ||
            options.needScrollCalculation && !this._options.needScrollCalculation
        )) {
            if (options.needScrollCalculation) {
                if (options.useNewModel) {
                    ScrollController._setCollectionIterator(options.collection, options.virtualScrollConfig.mode);
                }
            }
            this._initVirtualScroll(options);
            this._options.collection = options.collection;
            this._options.needScrollCalculation = options.needScrollCalculation;
        }
        if (options.attachLoadTopTriggerToNull !== this._options.attachLoadTopTriggerToNull) {
            this._options.attachLoadTopTriggerToNull = options.attachLoadTopTriggerToNull
        }
       
        if (options.activeElement) {
            this._options.activeElement = options.activeElement;
        }
        
        this._isRendering = true;
        return this.updateScrollParams(params);
    }

    needToSaveAndRestoreScrollPosition(): boolean {
        return !!(this._virtualScroll && this._virtualScroll.isNeedToRestorePosition);
    }

    afterRender(): boolean {
        this._isRendering = false;
        return this._afterRenderHandler();
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
                                    this._changedPlaceholders = rangeShiftResult.placeholders;
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
     * ЗАпоминает состояние видимости триггера
     * @param triggerName
     * @param triggerVisible
     */
    setTriggerVisibility(triggerName: IDirection, triggerVisible: boolean): void {
        this._triggerVisibility[triggerName] = triggerVisible;
    }

    /**
     * Обработчик на событие скролла
     */
    scrollPositionChange(params: IScrollParams, virtual: boolean): IScrollControllerResult {
        if (virtual) {
            return this.getResult(this.virtualScrollPositionChanged(params));
        } else {
            return this.getResult(this.scrollPositionChanged(params));
        }
    }

    private scrollPositionChanged(params: IScrollParams): IScrollControllerResult {

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
                    return { activeElement };
                }
            }
        }
    }

    /**
     * Обработчик изменения положения виртуального скролла
     * @param params
     * @private
     */
    private virtualScrollPositionChanged(params: IScrollParams): IScrollControllerResult  {
        if (this._virtualScroll) {
            const rangeShiftResult = this._virtualScroll.shiftRangeToScrollPosition(params.scrollTop);
            this._setCollectionIndices(this._options.collection, rangeShiftResult.range, false,
                this._options.needScrollCalculation);
            this.doAfterRender(params.applyScrollTopCallback);
            return {placeholders: rangeShiftResult.placeholders};
        }
    }

    /**
     * Производит пересчет диапазона в переданную сторону
     * @param direction
     */
    tryShiftToDirection(direction: IDirection): boolean {
        if (
            !this._virtualScroll ||
            this._virtualScroll &&
            !this._virtualScroll.rangeChanged &&
            this._virtualScroll.isRangeOnEdge(direction) ||
            !this._virtualScroll && this._options.virtualScrollConfig &&
            this._options.virtualScrollConfig.pageSize > this._options.collection.getCount()
        ) {
            return false;
        } else {
            if (this._virtualScroll && !this._virtualScroll.rangeChanged) {
                this._inertialScrolling.callAfterScrollStopped(() => {
                    const rangeShiftResult = this._virtualScroll.shiftRange(direction);
                    this._changedPlaceholders = rangeShiftResult.placeholders;
                    this._setCollectionIndices(this._options.collection, rangeShiftResult.range, false,
                        this._options.needScrollCalculation);
                    this._indicatorState = direction;
                });
                return true;
            }
        }
    }
    
    updateItemsHeights(itemsHeights: IItemsHeights) {
        this._virtualScroll.updateItemsHeights(itemsHeights);
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
    private doAfterRender(callback: Function): void {
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
    handleAddItems(addIndex: number, items: object[], direction?: IDirection): IScrollControllerResult {
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
        return this.getResult({ placeholders: rangeShiftResult.placeholders });
    }
    
    /**
     * Обрабатывает удаление элементов из коллекции
     * @param removeIndex
     * @param items
     * @param forcedShift
     * @private
     */
    handleRemoveItems(removeIndex: number, items: object[], forcedShift: boolean): IScrollControllerResult {
        if (this._virtualScroll) {
            const rangeShiftResult = this._virtualScroll.removeItems(removeIndex, items.length, forcedShift);
            this._setCollectionIndices(this._options.collection, rangeShiftResult.range, false,
                this._options.needScrollCalculation);
            this.setIndicesAfterCollectionChange();
            return this.getResult({ placeholders: rangeShiftResult.placeholders });
        }
    }

    handleResetItems(): IScrollControllerResult {
        let placeholders = this._initVirtualScroll(this._options);
        this.setIndicesAfterCollectionChange();
        return this.getResult({ placeholders });
    }


    private getTriggerOffset(scrollHeight: number, viewportHeight: number, attachLoadTopTriggerToNull: boolean): {top: number, bottom: number} {
        this._triggerOffset =
            (scrollHeight && viewportHeight ? Math.min(scrollHeight, viewportHeight) : 0) *
            this._options._triggerPositionCoefficient;
        const topTriggerOffset = attachLoadTopTriggerToNull ? 0 : this._triggerOffset;
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

    static getDefaultOptions(): Partial<IOptions> {
        return {
            virtualScrollConfig: {
                mode: 'remove'
            },
            _triggerPositionCoefficient: 0.3
        };
    }
}
