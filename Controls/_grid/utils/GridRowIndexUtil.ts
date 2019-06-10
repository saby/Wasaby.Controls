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
    display: Collection<unknown, CollectionItem<unknown>>,
    hasHeader: boolean,
    resultsPosition?: 'top' | 'bottom';
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
    
    if (cfg.resultsPosition === "bottom") {
        let itemsCount = cfg.display.getCount();
        
        if (itemsCount) {
            index += itemsCount;
        } else {
            index += cfg.hasEmptyTemplate ? 1 : 0;
        }
    }
    
    return index;
}



/**
 * Возвращает номер строки в списке для строки подвала.
 *
 * @param {GridRowIndexOptions<HasEmptyTemplate>} cfg Конфигурационый объект.
 * @return {Number} Номер строки в списке для строки подвала
 */
function getFooterIndex(cfg: GridRowIndexOptions<HasEmptyTemplate>): number {
    let
        hasResults = !!cfg.resultsPosition,
        itemsCount = cfg.display.getCount(), index = 0;
    
    index += cfg.hasHeader ? 1 : 0;
    index += hasResults ? 1 : 0;
    
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
function getTopOffset(hasHeader: boolean, resultsPosition: GridRowIndexOptions["resultsPosition"] = null): number {
    let
        topOffset = 0;
    
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
function getItemRealIndex(cfg: GridRowIndexOptions<DisplayItemIndex>): number {
    return cfg.index + getTopOffset(cfg.hasHeader, cfg.resultsPosition);
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
    getTopOffset
}