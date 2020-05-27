import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_scroll/Scroll/ContainerBase/ContainerBase');
import {Registrar} from 'Controls/event';
import {SyntheticEvent} from 'Vdom/Vdom';

interface IContainerBaseOptions extends IControlOptions {
    scrollMode?: string;
    task1178703223?: any;
}

interface IResizeObserver {
    observe: (el: HTMLElement) => void;
    disconnect: () => void;
}

interface IRegistrar {
    start: (eventType: string, params: object) => void;
    register: (event: SyntheticEvent, params: object, callback: () => void) => void;
    startOnceTarget: (component: any, eventType: string, params: object) => void;
    unregister: (event: SyntheticEvent, params: object) => void;
    destroy: () => void;
    _registry: any;
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

export default class ContainerBase extends Control<IContainerBaseOptions> {
    protected _template: TemplateFunction = template;
    protected _container: HTMLElement = null;
    protected _options: IContainerBaseOptions;

    private _state: IState = null;
    private _oldState: IState = null;

    private _registrar: IRegistrar = null;

    private _resizeObserver: IResizeObserver;

    private _topPlaceholderSize: number;
    private _bottomPlaceholderSize: number;

    _beforeMount(options: IControlOptions): void {
        this._registrar = new Registrar({register: 'scrollStateChanged'});
    }

    _afterMount(): void {
        this._initializeResizeHandler();
        if (this._updateState()) {
            this._sendByRegistrar('scrollStateChanged', {
                state: this._state,
                oldState: this._oldState
            });
        }
    }

    _beforeUnmount(): void {
        this._terminateResizeHandler();
        this._registrar.destroy();
        this._state = null;
        this._oldState = null;
    }

    _sendByRegistrar(eventType: string, params: object): void {
        this._registrar.start(params);
        this._notify(eventType, [params]);
    }

    _resizeHandler(e: SyntheticEvent): void {
        this._onResizeContainer();
    }

    _scrollHandler(e: SyntheticEvent): void {
        this.onScrollContainer();
    }

    _registerIt(event: SyntheticEvent, registerType: string, component: any,
                callback: () => void, triggers: object): void {
        if (registerType === 'scrollStateChanged') {
            this._registrar.register(event, component, callback);
            this._onRegisterNewComponent(component);
        }
    }

    _unRegisterIt(e: SyntheticEvent, registerType: string, component: any): void {
        if (registerType === 'scrollStateChanged') {
            this._registrar.unregister(e, component);
        }
    }

    setScrollTop(scrollTop: number, withoutPlaceholder?: boolean): void {
        if (!this._isVirtualPlaceholderMode() && withoutPlaceholder) {
            this._container.scrollTop = scrollTop;
            this.onScrollContainer();
        }
    }

    onScrollContainer(): void {
        this._updateState();
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

    _isVirtualPlaceholderMode(): number {
        return this._topPlaceholderSize || this._bottomPlaceholderSize;
    }

    _onRegisterNewComponent(component: any): void {
        this._updateState();
        if (this._calcCanScroll) {
            this._sendByRegistrar('scrollStateChanged', {
                state: this._state,
                oldState: this._oldState
            });
        }
    }

    _onResizeContainer(): void {
        const isStateUpdated = this._updateState();
        if (isStateUpdated) {
            this._sendByRegistrar('scrollStateChanged', {
                state: this._state,
                oldState: this._oldState
            });
        }
    }

    _initializeResizeHandler(): void {
        if (typeof window !== 'undefined' && window.ResizeObserver) {
            this._resizeObserver = new ResizeObserver(() => {
                this._onResizeContainer();
            });
            this._resizeObserver.observe(this._container);
            this._resizeObserver.observe(this._children.contentObserver);
        } else {
            this._notify('register', ['controlResize', this, this._resizeHandler], {bubbling: true});
        }
    }

    _terminateResizeHandler(): void {
        if (typeof window !== 'undefined' && window.ResizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        } else {
            this._notify('unregister', ['controlResize', this], {bubbling: true});
        }
    }

    _updateState(): boolean {
        if (!this._state || this._state.scrollTop !== this._container.scrollTop ||
            this._state.scrollLeft !== this._container.scrollLeft ||
            this._state.clientHeight !== this._container.clientHeight ||
            this._state.scrollHeight !== this._children.contentObserver.scrollHeight ||
            this._state.clientWidth !== this._container.clientWidth ||
            this._state.scrollWidth !== this._children.contentObserver.scrollWidth) {
                this._oldState = {...this._state};
                this._state = {
                    scrollTop: this._container.scrollTop,
                    scrollLeft: this._container.scrollLeft,
                    clientHeight: this._container.clientHeight,
                    scrollHeight: this._children.contentObserver.scrollHeight,
                    clientWidth: this._container.clientWidth,
                    scrollWidth: this._children.contentObserver.scrollWidth,
                    verticalPosition: this._getVerticalPosition(),
                    horizontalPosition: this._getHorizontalPosition(),
                    canScroll: this._calcCanScroll(),
                    viewPortRect: this._children.contentObserver.getBoundingClientRect()
                };
                return true;
        } else {
            return false;
        }
    }

    _calcCanScroll(): boolean {
        return this._container.scrollHeight - this._container.clientHeight > 1;
    }

    static _theme: string[] = ['Controls/scroll'];
}