import {canScrollByState, getScrollPositionTypeByState, SCROLL_DIRECTION} from 'Controls/_scroll/Utils/Scroll';

export interface IScrollState {
    scrollTop?: number;
    scrollLeft?: number;
    clientHeight?: number;
    scrollHeight?: number;
    clientWidth?: number;
    scrollWidth?: number;
    verticalPosition?: string;
    horizontalPosition?: string;
    canVerticalScroll?: boolean;
    canHorizontalScroll?: boolean;
    viewPortRect?: ClientRect;
}

interface IHasUnrenderedContent {
    top: boolean;
    bottom: boolean;
}

export default class ScrollState implements IScrollState {

    private _content: HTMLElement;
    private _scrollTop?: number;
    private _scrollLeft?: number;
    private _clientHeight?: number;
    private _scrollHeight?: number;
    private _clientWidth?: number;
    private _scrollWidth?: number;
    private _hasUnrenderedContent: IHasUnrenderedContent;

    constructor(content: HTMLElement, scrollState: IScrollState) {
        this._content = content;
        this._scrollTop = scrollState.scrollTop;
        this._scrollLeft = scrollState.scrollLeft;
        this._clientHeight = scrollState.clientHeight;
        this._scrollHeight = scrollState.scrollHeight;
        this._clientWidth = scrollState.clientWidth;
        this._scrollWidth = scrollState.scrollWidth;
        this._hasUnrenderedContent = {
            top: false,
            bottom: false
        };
    }

    get hasUnrenderedContent(): IHasUnrenderedContent {
        return this._hasUnrenderedContent;
    }

    set hasUnrenderedContent(value): void {
        this._hasUnrenderedContent = value;
    }

    get scrollTop(): number {
        return this._scrollTop;
    }

    set scrollTop(value: number): void {
        this._scrollTop = value;
    }

    get scrollLeft(): number {
        return this._scrollLeft;
    }

    set scrollTop(value: number): void {
        this._scrollLeft = value;
    }

    get clientHeight(): number {
        return this._clientHeight;
    }

    set scrollTop(value: number): void {
        this._clientHeight = value;
    }

    get clientWidth(): number {
        return this._clientWidth;
    }

    set scrollTop(value: number): void {
        this._clientWidth = value;
    }

    get scrollHeight(): number {
        return this._scrollHeight;
    }

    set scrollTop(value: number): void {
        this._scrollHeight = value;
    }

    get scrollWidth(): number {
        return this._scrollWidth;
    }

    set scrollTop(value: number): void {
        this._scrollWidth = value;
    }

    get canVerticalScroll(): boolean {
        return canScrollByState(this, SCROLL_DIRECTION.VERTICAL);
    }

    get canHorizontalScroll(): boolean {
        return canScrollByState(this, SCROLL_DIRECTION.HORIZONTAL);
    }

    get verticalPosition(): string {
        return getScrollPositionTypeByState(this, SCROLL_DIRECTION.VERTICAL);
    }

    get horizontalPosition(): string {
        return getScrollPositionTypeByState(this, SCROLL_DIRECTION.HORIZONTAL);
    }

    get viewPortRect(): ClientRect {
        return this._content.getBoundingClientRect();
    }

    clone(): ScrollState {
        const scrollState = {
            scrollTop: this._scrollTop,
            scrollLeft: this._scrollLeft,
            clientHeight: this._clientHeight,
            scrollHeight: this._scrollHeight,
            clientWidth: this._clientWidth,
            scrollWidth: this._scrollWidth
        };
        return new ScrollState(this._content, scrollState);
    }
}
