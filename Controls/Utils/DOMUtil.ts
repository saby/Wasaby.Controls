import {throttle} from 'Types/function';
import {constants} from 'Env/Env';

const MINIMAL_DEVICE_REFLOW_DELAY = 100;
const DECIMAL = 10;

/**
 * Функция вызывающая forced reflow с корня DOM-дерева
 */
export const reflow = throttle(() => {
    if (constants.isBrowserPlatform) {
        document.body.style.transform = 'translate(0px)';

        setTimeout(() => {
            document.body.style.transform = '';
        }, MINIMAL_DEVICE_REFLOW_DELAY);
    }
}, MINIMAL_DEVICE_REFLOW_DELAY, true);

/**
 * Returns the internal width of the element (that is, after deduction the borders, padding and scroll bars)
 * @param {window.Node} container
 * @return {window.Number}
 **/
export function width(container: HTMLElement | unknown): number {
    let computedStyle;
    let containerWidth;

    // toDO Проверка на jQuery до исправления этой ошибки https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
    // @ts-ignore
    if (window.jQuery && container instanceof window.jQuery) {
        containerWidth = container.width();

        // @ts-ignore
    } else if (container instanceof window.Node) {
        containerWidth = container.clientWidth;

        if (window.getComputedStyle) {
            computedStyle = window.getComputedStyle(container);
            containerWidth -= parseInt(computedStyle.paddingLeft, DECIMAL) + parseInt(computedStyle.paddingRight, DECIMAL);
        }
    }

    return containerWidth;
}
