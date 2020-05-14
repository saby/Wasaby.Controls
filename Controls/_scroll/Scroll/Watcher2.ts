import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_scroll/Scroll/Watcher/Watcher2');
import {Registrar} from 'Controls/event';
import {SyntheticEvent} from 'Vdom/Vdom';

interface IResizeObserver {
    observe: (el: HTMLElement) => void;
    unobserve: (el: HTMLElement) => void;
    disconnect: () => void;
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

    private _resizeObserver: IResizeObserver;

    _beforeMount(options: IControlOptions): void {
        //
    }

    _afterMount(): void {
        this._updateState();
        this._initResizeHandler();
    }

    _resizeHandler(e: SyntheticEvent): void {
        this._onResizeContainer();
    }

    _onResizeContainer(): void {
        // //this._notify("scrollStateChanged", [this.startValue, this.endValue]);
        // console.log('this._scrollTop:',this._scrollTop);
        // console.log('this._container.scrollTop:',this._container.scrollTop);
        //
        // console.log('this._clientHeight:',this._clientHeight);
        // console.log('this._container.clientHeight:',this._container.clientHeight);
        //
        // console.log('this._scrollHeight:',this._scrollHeight);
        // console.log('this._container.scrollHeight:',this._container.scrollHeight);
        this._updateState();
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

    _updateState(): void {
        if (this._state) {
            // for (const key of Object.keys(this._state)) {
            //     if (this._state[key] !== this._container[key]) {
            //         console.log('key:', key);
            //     }
            // }

        } else {
            this._state = {
                scrollTop: this._container.scrollTop,
                clientHeight: this._container.clientHeight,
                clientWidth: this._container.clientWidth,
                scrollHeight: this._container.scrollHeight,
                scrollWidth: this._container.scrollWidth
            };
            //this._oldState = Copy state
        }
    }
}
