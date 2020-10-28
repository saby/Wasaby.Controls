/**
 *
 * Модуль, в котором описана функция <b>hasScrollbar(element, kind)</b>.
 * @remark
 * Определяет, показаны ли полосы прокрутки (скроллбары) в элементе.
 * Способ не очень быстрый, но надёжный.
 *
 * Параметры функции:
 * 
 * 1. <b>element</b> {HTML|jQuery} - Элемент HTML DOM или jQuery.
 * 2. <b>[kind]</b> {String} - тип полосы прокрутки (скроллбара): undefined (любой), 'x' (горизонтальный) или 'y' (вертикальный).
 *
 * Возвращает: Boolean
 *
 * @class Controls/_utils/sizeUtils/HasScrollbar
 * @public
 * @author Крайнов Д.О.
 */
export function hasScrollbar(element: HTMLElement | unknown, kind?: 'x' | 'y'): boolean {
    let result = false;

    // @ts-ignore
    const el = element.length ? element[0] : element; //это может быть DOM-объект, а не jQuery-объект
    if (el) {
        //проверим, есть ли полосы прокрутки
        if (kind === undefined || kind === 'y') {
            result = (el.scrollHeight > el.clientHeight);
        }

        if (!result && (kind === undefined || kind === 'x')) {
            result = (el.scrollWidth > el.clientWidth);
        }
    }

    return result;
}

/**
 * Определяет, показана ли горизонтальная полоса прокрутки в элементе.
 * @param element - Элемент HTML DOM или jQuery.
 * @return {Boolean}
 */

function horizontal(element: HTMLElement | unknown): boolean {
    return hasScrollbar(element, 'x');
}

/**
 * Определяет, показана ли вертикальная полоса прокрутки в элементе.
 * @param element - Элемент HTML DOM или jQuery.
 * @return {Boolean}
 */

function vertical(element: HTMLElement | unknown): boolean {
    return hasScrollbar(element, 'y');
}

hasScrollbar.horizontal = horizontal;

hasScrollbar.vertical = vertical;
