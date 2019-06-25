import ItemsUtil = require('Controls/_list/resources/utils/ItemsUtil')
import {Collection, CollectionItem} from 'Types/display'

/**
 * @author Rodionov E.A.
 */



/**
 * @typedef {Object} IBaseGridRowIndexOptions Конфигурационый объект.
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {"top" | "bottom" | null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 */
interface IBaseGridRowIndexOptions {
    display: Collection<unknown, CollectionItem<unknown>>;
    hasHeader: boolean;
    resultsPosition?: 'top' | 'bottom';
    multyHeaderOffset?: number;
    editingRowIndex?: number
}

/**
 * @typedef {Object} ItemId Объект расширяющий базовую конфигурацию для получения индекса записи по идентификатору элемента таблицы.
 * @param {string} id Идентификатор элемента таблицы.
 */
type ItemId = { id: string };

/**
 * @typedef {Object} DisplayItem Объект расширяющий базовую конфигурацию для получения индекса записи по элементу проекции.
 * @param {'Types/display:CollectionItem'} item Элемент проекции таблицы.
 */
type DisplayItem = { item: CollectionItem<unknown> };

/**
 * @typedef {Object} DisplayItemIndex Объект расширяющий базовую конфигурацию для получения индекса записи по индексу элемента в проекции.
 * @param {number} index Индекс элемента в проекции.
 */
type DisplayItemIndex = { index: number }

/**
 * @typedef {Object} HasEmptyTemplate Объект расширяющий базовую конфигурацию, необходимый для расчета номера строки подвала и итогов таблицы.
 * @param {Boolean} hasEmptyTemplate Флаг, указывающий, задан ли шаблон отображения пустого списка.
 */
type HasEmptyTemplate = { hasEmptyTemplate: boolean };

/**
 * @typedef {IBaseGridRowIndexOptions & (DisplayItemIndex|DisplayItem|ItemId|HasEmptyTemplate)} GridRowIndexOptions Конфигурационый объект.
 */
type GridRowIndexOptions<T = DisplayItemIndex|DisplayItem|ItemId|HasEmptyTemplate> = IBaseGridRowIndexOptions & T;



/**
 * Возвращает номер строки в списке для элемента с указанным id.
 *
 * @param {GridRowIndexOptions<ItemId>} cfg Конфигурационый объект.
 * @return {Number} Номер строки в списке для элемента с указанным id.
 */
function getIndexById(cfg: GridRowIndexOptions<ItemId>): number {
    let
        idProperty = cfg.display.getIdProperty() || (<Collection<unknown>>cfg.display.getCollection()).getIdProperty(),
        item = ItemsUtil.getDisplayItemById(cfg.display, cfg.id, idProperty),
        index = cfg.display.getIndex(item);

    return getItemRealIndex(<GridRowIndexOptions<DisplayItemIndex>>{index, ...cfg});
}



/**
 * Возвращает номер строки в списке для указанного элемента.
 *
 * @param {GridRowIndexOptions<DisplayItem>} cfg Конфигурационый объект.
 * @return {Number} Номер строки в списке для указанного элемента проекции.
 */
function getIndexByItem(cfg: GridRowIndexOptions<DisplayItem>): number {
    let index = cfg.display.getIndex(cfg.item);
    return getItemRealIndex(<GridRowIndexOptions<DisplayItemIndex>>{index, ...cfg});

}



/**
 * Возвращает номер строки в списке для элемента с указанным индексом в проекции.
 *
 * @param {GridRowIndexOptions<DisplayItemIndex>} cfg Конфигурационый объект.
 * @return {Number} Номер строки элемента списка с указанным индексом в проекции.
 */
function getIndexByDisplayIndex(cfg: GridRowIndexOptions<DisplayItemIndex>): number {
    return getItemRealIndex(cfg);
}



/**
 * Возвращает номер строки в списке для строки результатов.
 *
 * @param {GridRowIndexOptions<HasEmptyTemplate>} cfg Конфигурационый объект.
 * @return {Number} Номер строки в списке для строки результатов.
 */
function getResultsIndex(cfg: GridRowIndexOptions<HasEmptyTemplate>): number {

    let index = cfg.hasHeader ? 1 : 0;
    index += cfg.multyHeaderOffset ? cfg.multyHeaderOffset : 0;

    if (cfg.resultsPosition === "bottom") {
        let
            itemsCount = cfg.display.getCount(),
            hasEditingItem = typeof cfg.editingRowIndex === "number";

        if (itemsCount) {
            index += itemsCount;
        } else {
            index += cfg.hasEmptyTemplate ? 1 : 0;
        }

        index += hasEditingItem ? 1 : 0;
    }

    return index;
}



/**
 * Возвращает номер строки в списке для строки подвала.
 *
 * @param {GridRowIndexOptions<HasEmptyTemplate>} cfg Конфигурационый объект.
 * @return {Number} Номер строки в списке для строки подвала
 */
//offset
function getFooterIndex(cfg: GridRowIndexOptions<HasEmptyTemplate>): number {
    let
        hasResults = !!cfg.resultsPosition,
        itemsCount = cfg.display.getCount(), index = 0,
        hasEditingItem = typeof cfg.editingRowIndex === "number";

    index += cfg.hasHeader ? 1 : 0;
    index += hasResults ? 1 : 0;
    index += cfg.multyHeaderOffset ? cfg.multyHeaderOffset : 0;
    index += hasEditingItem ? 1 : 0;

    if (itemsCount) {
        index += itemsCount;
    } else {
        index += cfg.hasEmptyTemplate ? 1 : 0;
    }

    return index;
}



/**
 * Возвращиет отступ сверху для первой записи списка.
 *
 * @param {GridRowIndexOptions.hasHeader} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {GridRowIndexOptions.resultsPosition} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @return {Number} Отступ сверху для первой записи списка
 */
//offset
function getTopOffset(hasHeader: boolean, resultsPosition: GridRowIndexOptions["resultsPosition"] = null, multyHeaderOffset: number): number {
    let
        topOffset = 0;
    topOffset += multyHeaderOffset ? multyHeaderOffset : 0;
    topOffset += hasHeader ? 1 : 0;
    topOffset += resultsPosition === "top" ? 1 : 0;

    return topOffset;
}



/**
 * Функция расчета номера строки в списке для элемента с указанным индексом в проекции.
 *
 * @private
 * @param {GridRowIndexOptions<HasEmptyTemplate>} cfg Конфигурационый объект.
 * @return {Number} Номера строки в списке для элемента с указанным индексом в проекции.
 */
// offset
function getItemRealIndex(cfg: GridRowIndexOptions<DisplayItemIndex>): number {
    return cfg.index + getTopOffset(cfg.hasHeader, cfg.resultsPosition, cfg.multyHeaderOffset);
}


/**
 * Функция takeWhile, для пика элеменотов до условия в отсортированном массиве.
 */
const takeWhile = (f, xs) => xs.length ? takeWhileNotEmpty(f, xs) : [];
const takeWhileNotEmpty = (f, [x, ...xs]) =>  f(x) ? [x, ...takeWhile(f, xs)] : [];

/**
 * Функция сортировки колонок хэдера начиная с левой стороны.
 * @param {Array} array Массив строк хэдера.
 * @return {Array} Отсортированный массив строк хэдера.
 */
function sortedColumns(array) {
    return array.map((cur) => {
        const sort = cur.sort((a, b) => {
            if (a.startColumn > b.startColumn) {
                return 1;
            }
            if (a.startColumn < b.startColumn) {
                return -1;
            }
            return 0;
        });
        return sort;
    });
}

/**
 * Функция подсчета строк в массиве объектов columns.
 * @param {Array} array Массив объектов columns.
 * @return {Number} Колличество строк в хэдере.
 */

function getRowsCount(array): number {
    let maxEndRow = 0;
    array.forEach((cur) => {
        if (cur.endRow > maxEndRow) {
            maxEndRow = cur.endRow;
        }
    });
    return maxEndRow - 1;
}

/**
 * Функция подсчета максимальной строки в массиве строк.
 * @param {Array} array Массив строк _headerRows.
 * @return {Number} Максимальная строка.
 */

function getMaxEndRow(array): number {
    let max = 0;
    if (array.length === 1) {
        return 2;
    }
    array.forEach((cur) => {
        cur.forEach((c) => {
            if (c.endRow > max) {
                max = c.endRow;
            }
        });
    });
    return max;
}

/**
 * Функция создания массива строк хэдера из массива объектов columns.
 * @param {Array} array Массив объектов columns.
 * @param {Boolean} hasMultiselect Отображаются чекбоксы или нет.
 * @return {Array} массив строк хэдера.
 * @example getROwsArray(
 *  [{title: 'name', startRow: 1, endRow: 2...}, {title: 'Price', startRow: 2, endRow: 3...}, ...], true
 *  ) -> [[{}, {title: 'name', startRow: 1, endRow: 2...}}], [{{title: 'Price', startRow: 2, endRow: 3...}}], ...]
 */

function getRowsArray(array, hasMultiselect) {
    let result = [];
    if (!array[0].startRow) {
        result.push(array);
    } else {
        let sortedArray = array.sort((a, b) => {
            if (a.startRow > b.startRow) {
                return 1;
            }
            if (a.startRow < b.startRow) {
                return -1;
            }
            return 0;
        });
        for (let i = 1, rows = getRowsCount(sortedArray); i <= rows; i++) {
            const odd = (x) => x.startRow === i;
            const row = takeWhile(odd, sortedArray);
            result.push(row);
            sortedArray = sortedArray.slice(row.length);
        }
        result = sortedColumns(result);
    }
    if (hasMultiselect) {
        result[0] = [{}, ...result[0]];
    }
    return result;
}

export {
    ItemId,
    DisplayItem,
    DisplayItemIndex,
    HasEmptyTemplate,

    IBaseGridRowIndexOptions,
    GridRowIndexOptions,

    getIndexById,
    getIndexByItem,
    getIndexByDisplayIndex,
    getResultsIndex,
    getFooterIndex,
    getTopOffset,
    getRowsArray,
    getMaxEndRow
}
