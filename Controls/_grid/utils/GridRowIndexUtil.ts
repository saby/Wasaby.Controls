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
function getIndexById(display: Display, id: string, hasHeader: boolean = false, resultsPosition: ResultsPosition = null): number {
    let
        idProperty = display.getIdProperty() || display.getCollection().getIdProperty(),
        item = ItemsUtil.getDisplayItemById(display, id, idProperty),
        displayIndex = display.getIndex(item);
    
    return getItemRealIndex(displayIndex, hasHeader, resultsPosition);
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
function getIndexByItem(display: Display, item: DItem, hasHeader: boolean = false, resultsPosition: ResultsPosition = null): number {
    return getItemRealIndex(display.getIndex(item), hasHeader, resultsPosition);
}


/**
 * Возвращает номер строки в списке для элемента с указанным индексом в проекции.
 *
 * @param {Number} index Индекс элемента списка в проекции.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @return {Number}
 */
function getIndexByDisplayIndex(index: number, hasHeader: boolean = false, resultsPosition: ResultsPosition = null): number {
    return getItemRealIndex(index, hasHeader, resultsPosition);
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
function getResultsIndex(display: Display, hasHeader: boolean, resultsPosition: ResultsPosition, hasEmptyTemplate: boolean): number {
    
    let index = hasHeader ? 1 : 0;
    
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
function getFooterIndex(display: Display, hasHeader: boolean, resultsPosition: ResultsPosition, hasEmptyTemplate: boolean): number {
    let
        hasResults = !!resultsPosition,
        itemsCount = display.getCount(), index = 0;
    
    index += hasHeader ? 1 : 0;
    index += hasResults ? 1 : 0;
    
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
function getTopOffset(hasHeader: boolean, resultsPosition: ResultsPosition = null): number {
    let
        topOffset = 0;
    
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
function getItemRealIndex(displayIndex: number, hasHeader: boolean, resultsPosition?: ResultsPosition): number {
    return displayIndex + getTopOffset(hasHeader, resultsPosition);
}


export {
    getIndexById,
    getIndexByItem,
    getIndexByDisplayIndex,
    getResultsIndex,
    getFooterIndex,
    getTopOffset
}