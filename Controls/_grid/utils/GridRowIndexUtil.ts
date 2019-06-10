import ItemsUtil = require('Controls/_list/resources/utils/ItemsUtil')
import {Collection, CollectionItem} from 'Types/display'

/**
 *
 *
 * @author Rodionov E.A.
 */

/**
 * @typedef {String} ResultsPosition
 * @variant top Результаты выводятся сверху таблицы.
 * @variant bottom Результаты выводятся снизу таблицы.
 */
type ResultsPosition = 'top' | 'bottom';

type DItem = CollectionItem<unknown>;
type Display = Collection<unknown, DItem>;


/**
 * Возвращает номер строки в списке для элемента с указанным id.
 *
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {string} id Ключ элемента списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @return {Number}
 */
function getIndexById(display: Display, id: string, hasHeader: boolean = false, resultsPosition: ResultsPosition = null, offset?: number): number {
    let
        idProperty = display.getIdProperty() || display.getCollection().getIdProperty(),
        item = ItemsUtil.getDisplayItemById(display, id, idProperty),
        displayIndex = display.getIndex(item);

    return getItemRealIndex(displayIndex, hasHeader, resultsPosition, offset);
}


/**
 * Возвращает номер строки в списке для указанного элемента.
 *
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {'Types/display:CollectionItem'} item Элемент списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @return {Number}
 */
function getIndexByItem(display: Display, item: DItem, hasHeader: boolean = false, resultsPosition: ResultsPosition = null, offset: number): number {
    return getItemRealIndex(display.getIndex(item), hasHeader, resultsPosition, offset);
}


/**
 * Возвращает номер строки в списке для элемента с указанным индексом в проекции.
 *
 * @param {Number} index Индекс элемента списка в проекции.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @return {Number}
 */
function getIndexByDisplayIndex(index: number, hasHeader: boolean = false, resultsPosition: ResultsPosition = null, offset: number): number {
    return getItemRealIndex(index, hasHeader, resultsPosition, offset);
}


/**
 * Возвращает номер строки в списке для строки результатов.
 *
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @param {Boolean} hasEmptyTemplate Флаг, указывающий, задан ли шаблон отображения пустого списка.
 * @return {Number}
 */
function getResultsIndex(display: Display, hasHeader: boolean, resultsPosition: ResultsPosition, hasEmptyTemplate: boolean, offset?: number): number {

    let index = hasHeader ? 1 : 0;

    index += offset ? offset : 0;

    if (resultsPosition === "bottom") {
        let itemsCount = display.getCount();

        if (itemsCount) {
            index += itemsCount;
        } else {
            index += hasEmptyTemplate ? 1 : 0;
        }
    }

    return index;
}


/**
 * Возвращает номер строки в списке для строки с подвалом.
 *
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @param {Boolean} hasEmptyTemplate Флаг, указывающий, задан ли шаблон отображения пустого списка.
 * @return {Number}
 */
function getFooterIndex(display: Display, hasHeader: boolean, resultsPosition: ResultsPosition, hasEmptyTemplate: boolean, offset: number): number {
    let
        hasResults = !!resultsPosition,
        itemsCount = display.getCount(), index = 0;

    index += hasHeader ? 1 : 0;
    index += hasResults ? 1 : 0;

    index += offset ? offset : 0;

    if (itemsCount) {
        index += itemsCount;
    } else {
        index += hasEmptyTemplate ? 1 : 0;
    }

    return index;
}


/**
 * Возвращиет отступ сверху для первой записи списка
 *
 * @private
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @return {Number}
 */
function getTopOffset(hasHeader: boolean, resultsPosition: ResultsPosition = null, offset: number): number {
    let
        topOffset = 0;
    topOffset += offset ? offset : 0;
    topOffset += hasHeader ? 1 : 0;
    topOffset += resultsPosition === "top" ? 1 : 0;

    return topOffset;
}


/**
 * Функция расчета номера строки в списке для элемента с указанным индексом в проекции.
 *
 * @param {Number} displayIndex Индекс элемента списка в проекции.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @return {Number}
 */
function getItemRealIndex(displayIndex: number, hasHeader: boolean, resultsPosition?: ResultsPosition, offset?: number): number {
    return displayIndex + getTopOffset(hasHeader, resultsPosition, offset);
}

/**
 * Функция takeWhile, для пика элеменотов до условия в отсортированном массиве.
 */

const takeWhile = (f, xs) => xs.length ? takeWhileNotEmpty(f, xs) : [];
const takeWhileNotEmpty = (f, [x, ...xs]) =>  f(x) ? [x, ...takeWhile(f, xs)] : [];

/**
 * Функция сортировки колонок хэдера начиная с левой стороны.
 * @param {Array} массив строк хэдера.
 * @return {Array} отсортированный массив строк хэдера.
 */

function sortedColumns(arr) {
    return arr.map((cur) => {
        const sort = cur.sort((a, b) => {
            if (a.startColumn > b.startColumn) {
                return 1;
            }
            if (a.startColumn < b.startColumn) {
                return -1;
            }
            return 0;
        })
        return sort;
    });
};

/**
 * Функция подсчета строк в массиве объектов columns.
 * @param {Array} массив объектов columns.
 * @return {Number} Колличество строк в хэдере.
 */

function getRowsCount(arr): number {
    let maxEndRow = 0;
    arr.forEach((cur) => {
        if (cur.endRow > maxEndRow) {
            maxEndRow = cur.endRow;
        }
    })
    return maxEndRow - 1;
}

/**
 * Функция подсчета максимальной строки в массиве строк.
 * @param {Array} массив строк _headerRows.
 * @return {Number} Максимальная строка.
 */

function getMaxEndRow(arr): number {
    let max = 0;
    if (arr.length === 1) {
        return 2;
    };
    arr.forEach((cur) => {
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
 * @param {Array} массив объектов columns.
 * @param {Boolean} отображаются чекбоксы или нет.
 * @return {Array} массив строк хэдера.
 * @example getROwsArray(
 *  [{title: 'name', startRow: 1, endRow: 2...}, {title: 'Price', startRow: 2, endRow: 3...}, ...], true
 *  ) -> [[{}, {title: 'name', startRow: 1, endRow: 2...}}], [{{title: 'Price', startRow: 2, endRow: 3...}}], ...]
 */

function getRowsArray(arr, multiSelectVisibility) {
    let result = [];
    if (!arr[0].startRow) {
        result.push(arr);
    } else {
        let sortedArray = arr.sort((a, b) => {
            if (a.startRow > b.startRow) {
                return 1;
            }
            if (a.startRow < b.startRow) {
                return -1;
            }
            return 0;
        })
        for (let i = 1, rows = getRowsCount(sortedArray); i <= rows; i++) {
            const odd = (x) => x.startRow === i;
            const row = takeWhile(odd, sortedArray);
            result.push(row);
            sortedArray = sortedArray.slice(row.length);
        }
        result = sortedColumns(result);
    }
    if (multiSelectVisibility) {
        result[0] = [{}, ...result[0]];
    }
    return result;
}

export {
    getIndexById,
    getIndexByItem,
    getIndexByDisplayIndex,
    getResultsIndex,
    getFooterIndex,
    getTopOffset,
    getRowsArray,
    getMaxEndRow
}
