import {detection} from 'Env/Env';
import {Bus} from 'Env/Event';
import {SyntheticEvent} from 'Vdom/Vdom';
import {RegisterClass, Registrar} from 'Controls/event';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import ResizeObserverUtil from 'Controls/Utils/ResizeObserverUtil';
import {canScrollByState, getScrollPositionTypeByState, SCROLL_DIRECTION} from './Utils/Scroll';
import {scrollTo} from './Utils/Scroll';
import {IScrollState} from './Utils/ScrollState';
import {SCROLL_MODE} from './Container/Type';
import template = require('wml!Controls/_scroll/ContainerBase/ContainerBase');
import tmplNotify = require('Controls/Utils/tmplNotify');
import * as scrollToElement from 'Controls/Utils/scrollToElement';

export interface IContainerBaseOptions extends IControlOptions {
    scrollMode?: SCROLL_MODE;
}

const KEYBOARD_SHOWING_DURATION: number = 500;

export default class ContainerBase extends Control<IContainerBaseOptions> {
    protected _template: TemplateFunction = template;
    protected _container: HTMLElement = null;
    protected _options: IContainerBaseOptions;

    protected _state: IScrollState = {};
    protected _oldState: IScrollState = null;

    private _registrars: any = [];

    private _resizeObserver: ResizeObserverUtil;

    private _resizeObserverSupported: boolean;
    // private _edgeObservers: IntersectionObserver[] = [];

    private _scrollLockedPosition: number = null;
    protected _scrollCssClass: string;

    protected _tmplNotify: Function = tmplNotify;

    // Виртуальный скролл
    private _topPlaceholderSize: number = 0;
    private _bottomPlaceholderSize: number = 0;

    private _savedScrollTop: number = 0;
    private _savedScrollPosition: number = 0;

    _beforeMount(options: IContainerBaseOptions): void {
        this._resizeObserver = new ResizeObserverUtil(this, this._resizeObserverCallback, this._resizeHandler);
        this._resizeObserverSupported = typeof window !== 'undefined' && window.ResizeObserver;
        this._registrars.scrollStateChanged = new RegisterClass({register: 'scrollStateChanged'});
        // событие viewportResize используется только в списках.
        this._registrars.viewportResize = new RegisterClass({register: 'viewportResize'});
        this._registrars.scrollResize = new RegisterClass({register: 'scrollResize'});
        this._registrars.scrollMove = new RegisterClass({register: 'scrollMove'});
        this._scrollCssClass = this._getScrollContainerCssClass(options);
        this._registrars.listScroll = new RegisterClass({register: 'listScroll'});
    }

    _afterMount(): void {
        this._resizeObserver.observe(this._children.scrollContainer);
        this._resizeObserver.observe(this._children.content);
        this._updateStateAndGenerateEvents(this._getFullStateFromDOM());
        // this._createEdgeIntersectionObserver();

        if (detection.isMobileIOS) {
            this._lockScrollPositionUntilKeyboardShown = this._lockScrollPositionUntilKeyboardShown.bind(this);
            Bus.globalChannel().subscribe('MobileInputFocus', this._lockScrollPositionUntilKeyboardShown);
        }
    }

    _beforeUpdate(options: IContainerBaseOptions) {
        if (options.scrollMode !== this._options.scrollMode) {
            this._scrollCssClass = this._getScrollContainerCssClass(options);
        }
    }

    _beforeUnmount(): void {
        this._resizeObserver.terminate();
        for (const registrar of this._registrars) {
            registrar.destroy();
        }
        this._state = null;
        this._oldState = null;
    }

    _resizeHandler(e: SyntheticEvent): void {
        this._onResizeContainer(this._getFullStateFromDOM());
    }

    _scrollHandler(e: SyntheticEvent): void {
        if (this._scrollLockedPosition !== null) {
            this._children.scrollContainer.scrollTop = this._scrollLockedPosition;
            return;
        }
        this.onScrollContainer({
            scrollTop: e.currentTarget.scrollTop,
            scrollLeft: e.currentTarget.scrollLeft,
        });
    }

    _registerIt(event: SyntheticEvent, registerType: string, component: any,
                callback: () => void, triggers): void {
        this._registrars.scrollStateChanged.register(event, registerType, component, callback);
        this._onRegisterNewComponent(component);
        // совместимость со списками
        if (registerType === 'listScroll') {
            if (triggers) {
                this._initIntersectionObserver(triggers, component);
            }
        }
    }

    _unRegisterIt(e: SyntheticEvent, registerType: string, component: any): void {
        this._registrars.scrollStateChanged.unregister(e, registerType, component);
    }

    // _createEdgeIntersectionObserver() {
    //     const rootMarginMap = {
    //         top: '0px 0px -99% 0px',
    //         bottom: '-99% 0px 0px 0px'
    //     }
    //     for (let edge in rootMarginMap) {
    //         this._edgeObservers[edge] = new IntersectionObserver(this._edgeIntersectionHandler.bind(this, edge), {
    //             root: this._children.scrollContainer,
    //             rootMargin: rootMarginMap[edge]
    //         });
    //         this._edgeObservers[edge].observe(this._children.content);
    //     }
    // }
    //
    // _edgeIntersectionHandler(edge, entries, observer): void {
    //     // console.log(edge);
    // }

    scrollTo(scrollPosition: number, direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL): void {
        scrollTo(this._children.scrollContainer, scrollPosition, direction);
    }

    onScrollContainer(newState: IScrollState): void {
        this._updateStateAndGenerateEvents(newState);
    }

    _onRegisterNewComponent(component: any): void {
        // Возможно тут лучше не вычитывать стэйт, а дождаться когда контрол его инициализирует и после этого послать событие.
        if (Object.keys(this._state).length === 0) {
            this._updateState(this._getFullStateFromDOM());
        }
        this._registrars.scrollStateChanged.startOnceTarget(component, {...this._state},{...this._oldState});
    }

    _onResizeContainer(newState: IScrollState): void {
        if (this._resizeObserverSupported) {
            this._updateStateAndGenerateEvents(newState);
        } else {
            this._updateStateAndGenerateEvents(this._getFullStateFromDOM());
        }
    }

    _updateStateAndGenerateEvents(newState: IScrollState): void {
        const isStateUpdated = this._updateState(newState);
        if (isStateUpdated) {
            // Новое событие
            this._sendByRegistrar('scrollStateChanged', [{...this._state}, {...this._oldState}]);

            if (this._state.scrollHeight !== this._oldState.scrollHeight) {
                this._sendByRegistrar('scrollResize', [{
                    scrollHeight: this._state.scrollHeight,
                    clientHeight: this._state.clientHeight
                }]);
            }

            if (this._oldState.clientHeight !== this._state.clientHeight) {
                this._sendByRegistrar('viewportResize', [{
                    scrollHeight: this._state.scrollHeight,
                    scrollTop: this._state.scrollTop,
                    clientHeight: this._state.clientHeight,
                    rect: this._state.viewPortRect
                }]);
            }

            if (this._oldState.verticalPosition !== this._state.verticalPosition) {
                this._sendByRegistrar('scrollMove', [{
                    scrollTop: this._state.scrollTop,
                    position: this._state.verticalPosition,
                    clientHeight: this._state.clientHeight,
                    scrollHeight: this._state.scrollHeight
                }]);
            }

            this._generateCompatibleEvents();
        }
    }

    _sendByRegistrar(eventType: string, params: object[]): void {
        this._registrars[eventType].start(...params);
        this._notify(eventType, params);
    }

    _resizeObserverCallback(entries: any): void {
        const newState: IScrollState = {};
        for (const entry of entries) {
            if (entry.target === this._children.scrollContainer) {
                newState.clientHeight = entry.contentRect.height;
                newState.clientWidth = entry.contentRect.width;
            }
            if (entry.target === this._children.content) {
                // Не можем брать размеры из события, т.к. на размеры скроллируемого контента могут влиять
                // маргины на вложенных контейнерах.
                // newState.scrollHeight = entry.contentRect.height;
                // newState.scrollWidth = entry.contentRect.width;
                newState.scrollHeight = this._children.scrollContainer.scrollHeight;
                newState.scrollWidth = this._children.scrollContainer.scrollWidth;
            }
        }
        this._onResizeContainer(newState);
    }

    _getFullStateFromDOM(): IScrollState {
        const newState = {
            scrollTop: this._children.scrollContainer.scrollTop,
            scrollLeft: this._children.scrollContainer.scrollLeft,
            clientHeight: this._children.scrollContainer.clientHeight,
            scrollHeight: this._children.scrollContainer.scrollHeight, // В observer берем со scrollContainer, иначе значения будут отличаться
            clientWidth: this._children.scrollContainer.clientWidth,
            scrollWidth: this._children.scrollContainer.scrollWidth
        };
        return newState;
    }

    _updateState(newState: IScrollState): boolean {
        let isStateUpdated = false;
        this._oldState = {...this._state};
        Object.keys(newState).forEach((key) => {
            if (this._state[key] !== newState[key]) {
                this._state[key] = newState[key];
                isStateUpdated = true;
            }
        }, newState);
        if (isStateUpdated) {
            this._updateCalculatedState();
        }
        return isStateUpdated;
    }

    _updateCalculatedState(): void {
        this._state.verticalPosition = getScrollPositionTypeByState(this._state, SCROLL_DIRECTION.VERTICAL);
        this._state.horizontalPosition = getScrollPositionTypeByState(this._state, SCROLL_DIRECTION.HORIZONTAL);
        this._state.canVerticalScroll = canScrollByState(this._state, SCROLL_DIRECTION.VERTICAL);
        this._state.canHorizontalScroll = canScrollByState(this._state, SCROLL_DIRECTION.HORIZONTAL);
        this._state.viewPortRect = this._children.scrollContainer.getBoundingClientRect();
    }

    /* При получении фокуса input'ами на IOS13, может вызывается подскролл у ближайшего контейнера со скролом,
       IPAD пытается переместить input к верху страницы. Проблема не повторяется,
       если input будет выше клавиатуры после открытия. */
    _lockScrollPositionUntilKeyboardShown(): void {
        this._scrollLockedPosition = this._state.scrollTop;
        setTimeout(() => {
            this._scrollLockedPosition = null;
        }, KEYBOARD_SHOWING_DURATION);
    }

    protected _doScroll(scrollParam) {
        if (scrollParam === 'top') {
            this.setScrollTop(0);
        } else {
            const
                clientHeight = this._state.clientHeight,
                scrollHeight = this._state.scrollHeight,
                currentScrollTop = this._state.scrollTop + (this._isVirtualPlaceholderMode() ? this._topPlaceholderSize : 0);
            if (scrollParam === 'bottom') {
                this.setScrollTop(scrollHeight - clientHeight);
            } else if (scrollParam === 'pageUp') {
                this.setScrollTop(currentScrollTop - clientHeight);
            } else if (scrollParam === 'pageDown') {
                this.setScrollTop(currentScrollTop + clientHeight);
            }
        }
    }

    protected _getScrollContainerCssClass(options: IContainerBaseOptions): string {
        return options.scrollMode === SCROLL_MODE.VERTICAL ?
                   'controls-Scroll-ContainerBase__scroll_vertical' :
                   'controls-Scroll-ContainerBase__scroll_verticalHorizontal'
    }

    // Слой совместимости с таблицами

    private _observers: {
        [id: string]: IntersectionObserver;
    } = {}

    private _generateCompatibleEvents(): void {
        if ((this._state.clientHeight !== this._oldState.clientHeight) ||
            (this._state.scrollHeight !== this._oldState.scrollHeight)) {
            this._sendByListScrollRegistrar('scrollResize', {
                scrollHeight: this._state.scrollHeight,
                clientHeight: this._state.clientHeight
            });
        }

        if (this._state.clientHeight !== this._oldState.clientHeight) {
            this._sendByListScrollRegistrar('viewportResize', {
                scrollHeight: this._state.scrollHeight,
                scrollTop: this._state.scrollTop,
                clientHeight: this._state.clientHeight,
                rect: this._state.viewPortRect
            });
        }

        if (this._state.verticalPosition !== this._oldState.verticalPosition) {
            this._sendByListScrollRegistrar('scrollMoveSync', {
                scrollTop: this._state.scrollTop,
                position: this._state.verticalPosition,
                clientHeight: this._state.clientHeight,
                scrollHeight: this._state.scrollHeight
            });

            setTimeout(() => {
                this._sendByListScrollRegistrar('scrollMove', {
                    scrollTop: this._state.scrollTop,
                    position: this._state.verticalPosition,
                    clientHeight: this._state.clientHeight,
                    scrollHeight: this._state.scrollHeight
                });
            }, 0);
        }

        if (this._state.canVerticalScroll !== this._oldState.canVerticalScroll) {
            this._sendByListScrollRegistrar(
                this._state.canVerticalScroll ? 'canScroll' : 'cantScroll',
                {
                    clientHeight: this._state.clientHeight,
                    scrollHeight: this._state.scrollHeight,
                    viewPortRect: this._state.viewPortRect
                });
        }
    }

    private _initIntersectionObserver(elements, component): void {
        if (!this._observers[component.getInstanceId()]) {
            let eventName;
            let curObserver: IntersectionObserver;


            curObserver = new IntersectionObserver((changes) => {
                /**
                 * Баг IntersectionObserver на Mac OS: сallback может вызываться после отписки от слежения. Отписка происходит в
                 * _beforeUnmount. Устанавливаем защиту.
                 */
                if (this._observers === null) {
                    return;
                }
                // Изменения необходимо проходить с конца, чтобы сначала нотифицировать о видимости нижнего триггера
                // Это необходимо для того, чтобы когда вся высота записей списочного контрола была меньше вьюпорта, то
                // сначала список заполнялся бы вниз, а не вверх, при этом сохраняя положение скролла
                for (var i = changes.length - 1; i > -1; i--) {
                    switch (changes[i].target) {
                        case elements.topLoadTrigger:
                            if (changes[i].isIntersecting) {
                                eventName = 'loadTopStart';
                            } else {
                                eventName = 'loadTopStop';
                            }
                            break;
                        case elements.bottomLoadTrigger:
                            if (changes[i].isIntersecting) {
                                eventName = 'loadBottomStart';
                            } else {
                                eventName = 'loadBottomStop';
                            }
                            break;
                        case elements.bottomVirtualScrollTrigger:
                            if (changes[i].isIntersecting) {
                                eventName = 'virtualPageBottomStart';
                            } else {
                                eventName = 'virtualPageBottomStop';
                            }
                            break;
                        case elements.topVirtualScrollTrigger:
                            if (changes[i].isIntersecting) {
                                eventName = 'virtualPageTopStart';
                            } else {
                                eventName = 'virtualPageTopStop';
                            }
                            break;
                    }
                    if (eventName) {
                        this._registrars.listScroll.startOnceTarget(component, eventName, {
                            scrollTop: this._state.scrollTop,
                            clientHeight: this._state.clientHeight,
                            scrollHeight: this._state.scrollHeight
                        });
                        this._notify(eventName);
                        eventName = null;
                    }
                }
            }, {root: this._container});
            curObserver.observe(elements.topLoadTrigger);
            curObserver.observe(elements.bottomLoadTrigger);

            curObserver.observe(elements.topVirtualScrollTrigger);
            curObserver.observe(elements.bottomVirtualScrollTrigger);

            this._observers[component.getInstanceId()] = curObserver;
        }
    }

    _sendByListScrollRegistrar(eventType: string, params: object): void {
        this._registrars.listScroll.start(eventType, params);
        this._notify(eventType, [params]);
    }

    _scrollToElement(event: SyntheticEvent<Event>, {itemContainer, toBottom, force}): void {
        event.stopPropagation();
        scrollToElement(itemContainer, toBottom, force);
    }

    // Виртуальный скролл

    private _isVirtualPlaceholderMode(): boolean {
        return !!this._topPlaceholderSize || !!this._bottomPlaceholderSize;
    }

    updatePlaceholdersSize(placeholdersSizes: object): void {
        this._topPlaceholderSize = placeholdersSizes.top;
        this._bottomPlaceholderSize = placeholdersSizes.bottom;
    }

    setScrollTop(scrollTop: number, withoutPlaceholder?: boolean): void {
        if (this._isVirtualPlaceholderMode() && !withoutPlaceholder) {
            const scrollState: IScrollState = this._state;
            const cachedScrollTop = scrollTop;
            const realScrollTop = scrollTop - this._topPlaceholderSize;
            const scrollTopOverflow = scrollState.scrollHeight - realScrollTop - scrollState.clientHeight < 0;
            const applyScrollTop = () => {

                // нужный scrollTop будет отличным от realScrollTop, если изменился _topPlaceholderSize. Вычисляем его по месту
                this._container.scrollTop = cachedScrollTop - this._topPlaceholderSize;
            };
            if (realScrollTop >= 0 && !scrollTopOverflow) {
                this._container.scrollTop = realScrollTop;
            } else if (this._topPlaceholderSize === 0 && realScrollTop < 0 || scrollTopOverflow && this._bottomPlaceholderSize === 0) {
                applyScrollTop();
            } else {
                this._sendByListScrollRegistrar(
                    'virtualScrollMove',
                    {
                        scrollTop,
                        scrollHeight: scrollState.scrollHeight,
                        clientHeight: scrollState.clientHeight,
                        applyScrollTopCallback: applyScrollTop
                    });
            }
        } else {
            this._container.scrollTop = scrollTop;
        }
    }


    private _saveScrollPosition(event: SyntheticEvent<Event>): void {
        // На это событие должен реагировать только ближайший скролл контейнер.
        // В противном случае произойдет подскролл в ненужном контейнере
        event.stopPropagation();

        this._savedScrollTop = this._children.scrollContainer.scrollTop;
        this._savedScrollPosition = this._children.scrollContainer.scrollHeight - this._savedScrollTop;
        // Инерционный скролл приводит к дерганью: мы уже
        // восстановили скролл, но инерционный скролл продолжает работать и после восстановления, как итог - прыжки,
        // дерганья и лишняя загрузка данных.
        // Поэтому перед восстановлением позиции скрола отключаем инерционный скролл, а затем включаем его обратно.
        // https://popmotion.io/blog/20170704-manually-set-scroll-while-ios-momentum-scroll-bounces/
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('hidden');
        }
    }

    private _restoreScrollPosition(event: SyntheticEvent<Event>, heightDifference: number, direction: string,
                           correctingHeight: number = 0): void {
        // На это событие должен реагировать только ближайший скролл контейнер.
        // В противном случае произойдет подскролл в ненужном контейнере
        event.stopPropagation();
        // Инерционный скролл приводит к дерганью: мы уже
        // восстановили скролл, но инерционный скролл продолжает работать и после восстановления, как итог - прыжки,
        // дерганья и лишняя загрузка данных.
        // Поэтому перед восстановлением позиции скрола отключаем инерционный скролл, а затем включаем его обратно.
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('');
        }
        const newPosition = direction === 'up' ?
            this._children.scrollContainer.scrollHeight - this._savedScrollPosition + heightDifference - correctingHeight :
            this._savedScrollTop - heightDifference + correctingHeight;

        this.setScrollTop(newPosition, true);
    }

    private _setOverflowScrolling(value: string): void {
        this._children.scrollContainer.style.overflow = value;
    }

    static _theme: string[] = ['Controls/scroll'];
}
