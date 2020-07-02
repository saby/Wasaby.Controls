import {IScrollState} from "./ScrollState";

export const enum SCROLL_DIRECTION {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal'
}

export function scrollTo(container: HTMLElement, position: number, direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL): void {
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        container.scrollTop = position;
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        container.scrollLeft = position;
    }
}

export function getScrollPositionByState(state:IScrollState, direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL) {
    let position: number;
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        position = state.scrollTop;
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        position = state.scrollLeft;
    }
    return position;
}

export function getViewportSizeByState(state:IScrollState, direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL) {
    let viewportSize: number;
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        viewportSize = state.clientHeight;
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        viewportSize = state.clientWidth;
    }
    return viewportSize;
}

export function getContentSizeByState(state:IScrollState, direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL) {
    let contentSize: number;
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        contentSize = state.scrollHeight;
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        contentSize = state.scrollWidth;
    }
    return contentSize;
}

export const enum EDGE_POSITION {
    START = 'start',
    END = 'end',
    MIDDLE = 'middle',
}

export function getScrollPositionType(scrollPosition: number, viewportSize: number, contentSize: number): EDGE_POSITION {
    let curPosition: EDGE_POSITION;
    if (scrollPosition <= 0) {
        curPosition = EDGE_POSITION.START;
    } else if (scrollPosition + viewportSize >= contentSize) {
        curPosition = EDGE_POSITION.END;
    } else {
        curPosition = EDGE_POSITION.MIDDLE;
    }
    return curPosition;
}

export function getScrollPositionTypeByState(scrollState: IScrollState,
                                             direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL): EDGE_POSITION {
    return getScrollPositionType(
        getScrollPositionByState(scrollState, direction),
        getViewportSizeByState(scrollState, direction),
        getContentSizeByState(scrollState, direction)
    );
}

export function canScroll(viewportSize: number, contentSize: number): boolean {
    return contentSize - viewportSize > 1;
}

export function canScrollByState(scrollState: IScrollState,
                                 direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL): boolean {
    return canScroll(
        getViewportSizeByState(scrollState, direction),
        getContentSizeByState(scrollState, direction)
    );
}