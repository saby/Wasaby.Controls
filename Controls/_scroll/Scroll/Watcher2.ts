import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_scroll/Scroll/Watcher/Watcher2');
import {Registrar} from 'Controls/event';
import {SyntheticEvent} from 'Vdom/Vdom';
import isEmpty = require('Core/helpers/Object/isEmpty');

interface IResizeObserver {
    observe: (el: HTMLElement) => void;
    unobserve: (el: HTMLElement) => void;
    disconnect: () => void;
}
interface IRegistrar {
    start: (eventType: string, params: object) => void;
    _registry: any;
    register: (event: SyntheticEvent, params: object, callback: () => void) => void;
    startOnceTarget: (component: any, eventType: string, params: object) => void;
}

interface IState {
    scrollTop: number;
    scrollLeft: number;
    clientHeight: number;
    scrollHeight: number;
    clientWidth: number;
    scrollWidth: number;

    verticalPosition: string;
    horizontalPosition: string;
    canScroll: boolean;
    viewPortRect: ClientRect;
}

export default class Component extends Control {
    protected _template: TemplateFunction = template;
    protected _container: HTMLElement = null;

    private _state: IState = null;
    private _oldState: IState = null;

    private _registrar: IRegistrar = null;

    private _resizeObserver: IResizeObserver;

    private _topPlaceholderSize: number;
    private _bottomPlaceholderSize: number;

    private _scrollTopTimer: number = null;

    _beforeMount(options: IControlOptions): void {
        this._registrar = new Registrar({register: 'scrollContainer'});
    }

    _afterMount(): void {
        this._initResizeHandler();
        if (this._updateState() && !isEmpty(this._registrar._registry)) {
            this._sendByRegistrar('scrollStateChanged', {
                state: this._state,
                oldState: this._oldState
            });
        }
    }

    _sendByRegistrar(eventType: string, params: object): void {
        this._registrar.start(eventType, params);
        this._notify(eventType, [params]);
    }

    _resizeHandler(e: SyntheticEvent): void {
        this._onResizeContainer();
    }

    _scrollHandler(e: SyntheticEvent): void {
        this._onScrollContainer();
    }

    _onScrollContainer(): void {
        const isStateUpdated = this._updateState();

        if (this._options.task1178703223 && this._state.scrollLeft &&
            this._options.scrollMode !== 'verticalHorizontal') {
            this._container.scrollLeft = 0;
        }
        if (this._state.scrollTop === this._oldState.scrollTop) {
            return;
        }

        this._sendByRegistrar('scrollStateChanged', {
            state: this._state,
            oldState: this._oldState
        });

        if (this._state.verticalPosition !== this._oldState.verticalPosition) {
            setTimeout(() => {
                this._sendByRegistrar('scrollMove', {
                    scrollTop: this._state.scrollTop,
                    position: this._state.verticalPosition,
                    clientHeight: this._state.clientHeight,
                    scrollHeight: this._state.scrollHeight
                });
            }, 0);
        }

        // если не почистить таймер, то может выполняться таймер из ветки ниже, т.к. он с паузой 100
        if (this._scrollTopTimer) {
            clearTimeout(this._scrollTopTimer);
            this._scrollTopTimer = null;
        } else {
            if (!this._scrollTopTimer) {
                this._scrollTopTimer = setTimeout(() => {
                    if (this._scrollTopTimer) {
                        this._sendByRegistrar('scrollMove', {
                            scrollTop: this._state.scrollTop,
                            position: this._state.verticalPosition,
                            clientHeight: this._state.clientHeight,
                            scrollHeight: this._state.scrollHeight
                        });
                        clearTimeout(this._scrollTopTimer);
                        this._scrollTopTimer = null;
                    }
                }, 100);
            }
        }
    }

    _getVerticalPosition(): string {
        let curPosition;
        if (this._container.scrollTop <= 0 && (!this._isVirtualPlaceholderMode() || this._topPlaceholderSize <= 0)) {
            curPosition = 'up';
        } else if ((this._container.scrollTop + this._container.clientHeight >= this._container.scrollHeight) &&
            (!this._isVirtualPlaceholderMode() || this._bottomPlaceholderSize <= 0)) {
            curPosition = 'down';
        } else {
            curPosition = 'middle';
        }
        return curPosition;
    }

    _getHorizontalPosition(): string {
        let curPosition;
        if (this._container.scrollLeft <= 0) {
            curPosition = 'left';
        } else if (this._container.scrollLeft + this._container.clientWidth >= this._container.scrollWidth) {
            curPosition = 'right';
        } else {
            curPosition = 'middle';
        }
        return curPosition;
    }

    _isVirtualPlaceholderMode(): boolean {
        return this._topPlaceholderSize || this._bottomPlaceholderSize;
    }

    _registerIt(event: SyntheticEvent, registerType: string, component: any,
                callback: () => void, triggers: object): void {
        //TODO заменить listScroll потом на что нибудь вроде containerScroll и удалить notify register
        if (registerType === 'listScroll') {
            this._registrar.register(event, component, callback);
            this._notify('register', ['listScroll', component, callback, triggers], {bubbling: true});
            this._onRegisterNewComponent(component);
        }
    }

    _onRegisterNewComponent(component: any): void {
        this._updateState();
        if (this._calcCanScroll) {
            this._sendByRegistrar('scrollStateChanged', {
                state: this._state,
                oldState: this._oldState
            });
        }

        this._registrar.startOnceTarget(component, 'viewportResize', {
            scrollHeight: this._state.scrollHeight,
            scrollTop: this._state.scrollTop,
            clientHeight: this._state.clientHeight,
            rect: this._container.getBoundingClientRect()
        });
    }

    _onResizeContainer(): void {
        const isStateUpdated = this._updateState();
        if (isStateUpdated) {
            this._sendByRegistrar('scrollStateChanged', {
                state: this._state,
                oldState: this._oldState
            });
        }

        if (this._oldState.scrollHeight !== this._state.scrollHeight) {
            this._sendByRegistrar('viewportResize', {
                scrollHeight: this._state.scrollHeight,
                scrollTop: this._state.scrollTop,
                clientHeight: this._state.clientHeight,
                rect: this._container.getBoundingClientRect()
            });
        }

        if ((this._oldState.clientHeight !== this._state.clientHeight) ||
            (this._oldState.scrollHeight !== this._state.scrollHeight)) {
            this._sendByRegistrar('scrollResize', {
                clientHeight: this._state.clientHeight,
                scrollHeight: this._state.scrollHeight
            });
        }
    }

    _initResizeHandler(): void {
        if (typeof window !== 'undefined' && window.ResizeObserver) {
            this._resizeObserver = new ResizeObserver(() => {
                this._onResizeContainer();
            });
            this._resizeObserver.observe(this._container);
            this._resizeObserver.observe(this._container.children.contentObserver);
        } else {
            this._notify('register', ['controlResize', this, this._resizeHandler], {bubbling: true});
        }
    }

    _updateState(): boolean {
        if (!this._state || this._state.scrollTop !== this._container.scrollTop ||
            this._state.scrollLeft !== this._container.scrollLeft ||
            this._state.clientHeight !== this._container.clientHeight ||
            this._state.scrollHeight !== this._container.scrollHeight ||
            this._state.clientWidth !== this._container.clientWidth ||
            this._state.scrollWidth !== this._container.scrollWidth) {
                this._oldState = {...this._state};
                this._state = {
                    scrollTop: this._container.scrollTop,
                    scrollLeft: this._container.scrollLeft,
                    clientHeight: this._container.clientHeight,
                    scrollHeight: this._container.scrollHeight,
                    clientWidth: this._container.clientWidth,
                    scrollWidth: this._container.scrollWidth,
                    verticalPosition: this._getVerticalPosition(),
                    horizontalPosition: this._getHorizontalPosition(),
                    canScroll: this._calcCanScroll(),
                    viewPortRect: this._container.getBoundingClientRect()
                };
                return true;
        } else {
            return false;
        }
    }

    _calcCanScroll(): boolean {
        return this._container.scrollHeight - this._container.clientHeight > 1;
    }
}
