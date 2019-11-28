import ItemsUtil = require('Controls/_list/resources/utils/ItemsUtil')
import {Collection, CollectionItem} from 'Types/display'

/**
 * @author Родионов Е.А.
 */


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

function getMaxEndRow(array): number[] {
    let maxRow = 0;
    let maxColumn = 0;
    let isMuliRow = true;
    if (array.length === 1) {
        isMuliRow = false;
        maxRow = 2;
    }
    array.forEach((cur) => {
        cur.forEach((c) => {
            if (isMuliRow && c.endRow > maxRow) {
                maxRow = c.endRow;
            }
            if (c.endColumn > maxColumn) {
                maxColumn = c.endColumn;
            }
        });
    });
    return [maxRow, maxColumn];
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

function getRowsArray(array, hasMultiselect, isMultiHeader) {
    let result = [];
    if (!isMultiHeader) {
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
            const odd = (x) => x.startRow === i || x.isBreadCrumbs;
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
    getRowsArray,
    getMaxEndRow
};
