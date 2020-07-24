// import {getScrollPositionType, canScroll} from 'Controls/_scroll/Scroll/Utils';
// import {SCROLL_DIRECTION} from './Scroll';

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

// export default class ScrollState implements IScrollState {
//
//     private _container: HTMLElement
//     readonly scrollTop?: number;
//     readonly scrollLeft?: number;
//     readonly clientHeight?: number;
//     readonly scrollHeight?: number;
//     readonly clientWidth?: number;
//     readonly scrollWidth?: number;
//
//     // Что бы не дублировать может сделать методами с аргументом direction
//     readonly canVerticalScroll?: boolean;
//     readonly canHorizontalScroll?: boolean;
//     readonly viewPortRect?: ClientRect;
//
//     constructor(container: HTMLElement,
//                 scrollTop?: number, scrollLeft?: number,
//                 clientHeight?: number, scrollHeight?: number,
//                 clientWidth?: number, scrollWidth?: number) {
//         this._container = container;
//         this.scrollTop = scrollTop;
//         this.scrollLeft = scrollLeft;
//         this.clientHeight = clientHeight;
//         this.scrollHeight = scrollHeight;
//         this.clientWidth = clientWidth;
//         this.scrollWidth = scrollWidth;
//     }
//
//     get verticalPosition(): number {
//         return getScrollPositionType(
//             this.getScrollPosition(SCROLL_DIRECTION.VERTICAL),
//             this.getViewportSize(SCROLL_DIRECTION.VERTICAL),
//             this.getContentSize(SCROLL_DIRECTION.VERTICAL)
//         );
//     }
//
//     get horizontalPosition(): number {
//         return getScrollPositionType(
//             this.getScrollPosition(SCROLL_DIRECTION.HORIZONTAL),
//             this.getViewportSize(SCROLL_DIRECTION.HORIZONTAL),
//             this.getContentSize(SCROLL_DIRECTION.HORIZONTAL)
//         );
//     }
// }
