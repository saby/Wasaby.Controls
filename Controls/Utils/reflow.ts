import {throttle} from 'Types/function';

const MINIMAL_DEVICE_REFLOW_DELAY = 100;

/**
 * Функция вызывающая forced reflow с корня DOM-дерева
 */
export default throttle(() => {
    document.body.style.transform = 'translate(0px)';

    setTimeout(() => {
        document.body.style.transform = '';
    }, MINIMAL_DEVICE_REFLOW_DELAY);
}, MINIMAL_DEVICE_REFLOW_DELAY, true);