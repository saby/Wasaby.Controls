import Component from '../Controller';
import {IResizeObserver} from '../interfaces';
import {RegisterUtil, UnregisterUtil} from 'Controls/event';

/**
 * Класс который следит за изменеием высот фиксированных заголовков. Используется ResizeObserver там
 * где он поддерживается. На остальных платформах используется подписка на событие controlResize.
 */

interface IHeightEntry {
    key: HTMLElement;
    value: number;
}

export default class StickyHeaderResizeObserver {
    private readonly _controller: Component;
    private readonly _resizeObserverSupported: boolean = false;
    private _resizeObserver: IResizeObserver;
    private _elementsHeight: IHeightEntry[] = [];

    constructor(controller: Component) {
        this._controller = controller;
        this._resizeObserverSupported = typeof window !== 'undefined' && window.ResizeObserver;
    }

    initialize(): void {
        if (this._resizeObserverSupported) {
            this._initResizeObserver();
        } else {
            RegisterUtil(this._controller, 'controlResize', this._controller._resizeHandler.bind(this._controller));
        }
    }

    private _initResizeObserver(): void {
        if (!this._resizeObserver) {
            this._resizeObserver = new ResizeObserver((entries) => {
                let heightChanged = false;
                for (const entry of entries) {
                    const heightEntry: IHeightEntry = this._elementsHeight.find((item: IHeightEntry) => {
                        return item.key === entry.target;
                    });

                    if (heightEntry) {
                        if (heightEntry.value !== entry.contentRect.height) {
                            heightEntry.value = entry.contentRect.height;
                            heightChanged = true;
                        }
                    } else {
                        // ResizeObserver всегда кидает событие сразу после добавления элемента. Не будем генрировать
                        // событие, а просто сохраним текущую высоту если это первое событие для элемента и высоту
                        // этого элемента мы еще не сохранили.
                        this._elementsHeight.push({key: entry.target, value: entry.contentRect.height});
                    }
                }
                if (heightChanged) {
                    this._controller._resizeHandler();
                }
            });
        }
    }

    terminate(): void {
        if (this._resizeObserverSupported) {
            this._resizeObserver.disconnect();
        } else {
            UnregisterUtil(this._controller, 'controlResize');
        }
    }

    observe(container: HTMLElement): void {
        if (this._resizeObserverSupported) {
            this._initResizeObserver();
            const stickyHeaders = this._getStickyHeaderElements(container);
            stickyHeaders.forEach((elem: HTMLElement) => {
                this._resizeObserver.observe(elem);
            });
        }
    }

    unobserve(container: HTMLElement): void {
        if (this._resizeObserverSupported) {
            const stickyHeaders = this._getStickyHeaderElements(container);
            stickyHeaders.forEach((elem: HTMLElement) => {
                this._resizeObserver.unobserve(elem);
            });
        }
    }

    private _getStickyHeaderElements(container: HTMLElement): NodeListOf<HTMLElement> {
        if (getComputedStyle(container, null).display === 'contents') {
            return container.querySelectorAll('.controls-StickyHeader');
        } else {
            return [container];
        }
    }
}
