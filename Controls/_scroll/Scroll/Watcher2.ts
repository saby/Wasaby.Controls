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

    _beforeMount(options: IControlOptions): void {
        this._registrar = new Registrar({register: 'scrollContainer'});
    }

    _afterMount(): void {
        this._initResizeHandler();
        if (!isEmpty(this._registrar._registry)) {
            this._notifyScrollStateChange();
        }
    }

    _sendByRegistrar(eventType: string, params: object): void {
        this._registrar.start(eventType, params);
        this._notify(eventType, [params]);
    }

    _resizeHandler(e: SyntheticEvent): void {
        this._onResizeContainer();
    }

    _registerIt(event, registerType, component, callback, triggers): void {
        console.log();
    }

    _onResizeContainer(): void {
        this._notifyScrollStateChange();
    }

    _notifyScrollStateChange(): boolean {
        if (this._updateState()) {
            this._sendByRegistrar('scrollStateChanged', {
                state: this._state,
                oldState: this._oldState
            });
            return true;
        }
        return false;
    }

    _initResizeHandler(): void {
        if (typeof window !== 'undefined' && window.ResizeObserver) {
            this._resizeObserver = new ResizeObserver(() => {
                this._onResizeContainer();
            });
            this._resizeObserver.observe(this._container);
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
                    verticalPosition: 'test',
                    horizontalPosition: 'test',
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
