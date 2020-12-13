import Controller, {IControllerOptions, JS_SELECTORS as COLUMN_SCROLL_JS} from 'Controls/_columnScroll/Controller'
import Thumb from 'Controls/_columnScroll/Thumb/Thumb';

const JS_SELECTORS = {
    ...COLUMN_SCROLL_JS,
    DRAG_SCROLL: {}
};

export {
    Controller,
    IControllerOptions,
    JS_SELECTORS,
    Thumb
}
