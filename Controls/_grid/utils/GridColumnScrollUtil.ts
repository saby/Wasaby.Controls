import {isFullGridSupport} from './GridLayoutUtil';
import {JS_SELECTORS as COLUMN_SCROLL_JS_SELECTORS} from './../resources/ColumnScroll';

interface IShouldAddActionsCellArgs {
    // legacy для работы со старыми браузерами
    isFullGridSupport: boolean;

    // Дополнительная колонка нужна только если есть скролл
    hasColumnScroll: boolean;

    // Не нужно ничего добавлять, когда колонок нет.
    // Всегда, когда нет колонок мы ничего больше не добавляем.
    // PS. Эта опция не учитывает, что в таблицу был передан header.
    hasColumns: boolean;

    // ополнительная колонка нужны, если itemActionsPosition !== custom
    itemActionsPosition?: string;
}

export function shouldAddActionsCell(opts: IShouldAddActionsCellArgs): boolean {
    return opts.hasColumns && opts.hasColumnScroll && opts.isFullGridSupport && (opts.itemActionsPosition !== 'custom');
}

export function shouldDrawColumnScroll(scrollContainer: HTMLDivElement, contentContainer: HTMLDivElement): boolean {
    const contentContainerSize = contentContainer.scrollWidth;
    const scrollContainerSize = isFullGridSupport() ? contentContainer.offsetWidth : scrollContainer.offsetWidth;
    return contentContainerSize > scrollContainerSize;
}

export function isColumnScrollShown(view: HTMLDivElement): boolean {
    const scrollContainer: HTMLDivElement = view.querySelector(`.${COLUMN_SCROLL_JS_SELECTORS.CONTAINER}`);
    const contentContainer: HTMLDivElement = view.querySelector(`.${COLUMN_SCROLL_JS_SELECTORS.CONTENT}`);

    if (scrollContainer && contentContainer) {
        const contentContainerSize = contentContainer.scrollWidth;
        const scrollContainerSize = isFullGridSupport() ? contentContainer.offsetWidth : scrollContainer.offsetWidth;
        return contentContainerSize > scrollContainerSize;
    }
    return false;
}
