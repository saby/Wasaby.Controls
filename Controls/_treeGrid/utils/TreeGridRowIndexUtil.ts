import ItemsUtil = require('Controls/_list/resources/utils/ItemsUtil')
import { relation } from 'Types/entity'
import { Collection, CollectionItem } from 'Types/display'


/**
 * @author Rodionov E.A.
 */


type DItem = CollectionItem<unknown>;
type Display = Collection<unknown, DItem>;


/**
 * @typedef {String} ResultsPosition
 * @variant top Результаты выводятся сверху таблицы.
 * @variant bottom Результаты выводятся снизу таблицы.
 */
type ResultsPosition = 'top' | 'bottom';


/**
 * @typedef {Object} HasMoreStorage
 */
type HasMoreStorage = Record<string, boolean>;


/**
 * @typedef {Object} ExpandedItems
 */
type ExpandedItems = Record<string, boolean>;


/**
 * Возвращает номер строки в списке для элемента с указанным id.
 *
 * @param {string} id Ключ элемента списка.
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @param {'Types/entity:relation.Hierarchy'} hierarchyRelation Объект, предоставляющий иерархические отношения дерева.
 * @param {HasMoreStorage} hasMoreStorage Объект, содержащий флаги наличия у узлов незагруженных дочерних записей(нужно ли показывать кнопку "Ещё").
 * @param {ExpandedItems} expandedItems Объект, содержащий флаги, указывающие какие узлы дерева раскрыты.
 * @param {Boolean} hasNodeFooterTemplate Флаг, указывающий нужно ли выводить подвалы для узлов.
 * @return {Number}
 */
function getIndexById(id: string,
                      display: Display,
                      hasHeader: boolean = false,
                      resultsPosition: ResultsPosition = null,
                      hierarchyRelation: relation.Hierarchy,
                      hasMoreStorage: HasMoreStorage,
                      expandedItems: ExpandedItems,
                      hasNodeFooterTemplate: boolean): number {
    
    let idProperty = display.getIdProperty() || display.getCollection().getIdProperty(),
        item = <DItem>ItemsUtil.getDisplayItemById(display, id, idProperty),
        displayIndex = display.getIndex(item);
    
    return getItemRealIndex(display, item, id, displayIndex, hasHeader, resultsPosition, hierarchyRelation, hasMoreStorage, expandedItems, hasNodeFooterTemplate);
}


/**
 * Возвращает номер строки в списке для указанного элемента.
 *
 * @param {'Types/display:CollectionItem'} item Элемент списка.
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @param {'Types/entity:relation.Hierarchy'} hierarchyRelation Объект, предоставляющий иерархические отношения дерева.
 * @param {HasMoreStorage} hasMoreStorage Объект, содержащий флаги наличия у узлов незагруженных дочерних записей(нужно ли показывать кнопку "Ещё").
 * @param {ExpandedItems} expandedItems Объект, содержащий флаги, указывающие какие узлы дерева раскрыты.
 * @param {Boolean} hasNodeFooterTemplate Флаг, указывающий нужно ли выводить подвалы для узлов.
 * @return {Number}
 */
function getIndexByItem(item: DItem,
                        display: Display,
                        hasHeader: boolean = false,
                        resultsPosition: ResultsPosition = null,
                        hierarchyRelation: relation.Hierarchy,
                        hasMoreStorage: HasMoreStorage = {},
                        expandedItems: ExpandedItems = {},
                        hasNodeFooterTemplate: boolean): number {
    
    let id = item.getContents().getId(),
        index = display.getIndex(item);
    
    return getItemRealIndex(display, item, id, index, hasHeader, resultsPosition, hierarchyRelation, hasMoreStorage, expandedItems, hasNodeFooterTemplate);
}


/**
 * Возвращает номер строки в списке для элемента с указанным индексом в проекции.
 *
 * @param {Number} index Индекс элемента списка в проекции.
 * @param {'Types/display'} display Проекция элементов списка.
 * @param {Boolean} hasHeader Флаг, указывающий на наличие заголовка в таблице.
 * @param {ResultsPosition|null} resultsPosition Позиция результатов таблицы. Null, если результаты не выводятся.
 * @param {'Types/entity:relation.Hierarchy'} hierarchyRelation Объект, предоставляющий иерархические отношения дерева.
 * @param {HasMoreStorage} hasMoreStorage Объект, содержащий флаги наличия у узлов незагруженных дочерних записей(нужно ли показывать кнопку "Ещё").
 * @param {ExpandedItems} expandedItems Объект, содержащий флаги, указывающие какие узлы дерева раскрыты.
 * @param {Boolean} hasNodeFooterTemplate Флаг, указывающий нужно ли выводить подвалы для узлов.
 * @return {Number}
 */
function getIndexByDisplayIndex(index: number,
                                display: Display,
                                hasHeader: boolean = false,
                                resultsPosition: ResultsPosition = null,
                                hierarchyRelation: relation.Hierarchy,
                                hasMoreStorage: HasMoreStorage = {},
                                expandedItems: ExpandedItems = {},
                                hasNodeFooterTemplate: boolean): number {
    
    let item = display.at(index).getContents(),
        id = item.getId ? item.getId() : item;
    
    return getItemRealIndex(display, item, id, index, hasHeader, resultsPosition, hierarchyRelation, hasMoreStorage, expandedItems, hasNodeFooterTemplate);
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
function getResultsIndex(display: Display, hasHeader: boolean, resultsPosition: ResultsPosition, hasEmptyTemplate: boolean) {
    let index = hasHeader ? 1 : 0;
    
    if (resultsPosition === "bottom") {
        let itemsCount = display.getCount();
        
        if (itemsCount) {
            // Чтобы ради подвала снова не считать индекс последнего элемента на экране,
            // который кстати сначала нужно найти, просто берем общее количество элементов
            // и считаем что у каждего есть подвал.
            // Магическая вещь. Может когда-нибудь сломаться, но пока работает
            index += itemsCount * 2;
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
        itemsCount = display.getCount(),
        index = 0;
    
    index += hasHeader ? 1 : 0;
    index += hasResults ? 1 : 0;
    
    if (itemsCount) {
        index += itemsCount * 2;
    } else {
        index += hasEmptyTemplate ? 1 : 0;
    }
    
    return index;
}


export {
    getIndexById,
    getIndexByItem,
    getIndexByDisplayIndex,
    getResultsIndex,
    getFooterIndex
}



// region private functions

/**
 * Возвращиет отступ сверху для первой записи списка
 *
 * @private
 */
function getTopOffset(hasHeader: boolean, resultsPosition: ResultsPosition = null): number {
    let
        topOffset = 0;
    
    topOffset += hasHeader ? 1 : 0;
    topOffset += resultsPosition === "top" ? 1 : 0;
    
    return topOffset;
}



/**
 * Функция расчета номера строки в списке для заданного элемента.
 *
 * @private
 */
function getItemRealIndex(display: Display,
                          item: DItem,
                          itemId: string,
                          displayIndex: number,
                          hasHeader: boolean,
                          resultsPosition: ResultsPosition = null,
                          hierarchyRelation: relation.Hierarchy,
                          hasMoreStorage: HasMoreStorage,
                          expandedItems: ExpandedItems,
                          hasNodeFooterTemplate: boolean): number {
    
    hasMoreStorage = hasMoreStorage || {};
    expandedItems = expandedItems || {};
    
    let realIndex = displayIndex + getTopOffset(hasHeader, resultsPosition);
    
    if (display.getCount() === 1) {
        return realIndex;
    } else {
        realIndex += calcNodeFootersBeforeItem(display, itemId, displayIndex, hierarchyRelation, hasMoreStorage, expandedItems, hasNodeFooterTemplate);
    }
    
    return realIndex;
}



/**
 * Возвращает количество всех видимых подвалов узлов перед("выше") заданным элементом.
 *
 * @private
 */
function calcNodeFootersBeforeItem(display: Display,
                                   itemId: string,
                                   itemIndex: number,
                                   hierarchyRelation: relation.Hierarchy,
                                   hasMoreStorage: HasMoreStorage,
                                   expandedItems: ExpandedItems,
                                   hasNodeFooterTemplate: boolean): number {
    
    let
        count = 0,
        nasNodeFootersStorage: Record<string, boolean> = {},
        elementsChildCountStorage: Record<string, number> = {},
        idProperty: string = display.getIdProperty() || display.getCollection().getIdProperty();
    
    if (hasNodeFooterTemplate) {
        for (let id in expandedItems) {
            if (id !== itemId) {
                let
                    expandedItem = ItemsUtil.getDisplayItemById(display, id, idProperty),
                    expandedItemIndex = display.getIndex(expandedItem);
                
                if (expandedItemIndex >= itemIndex) {
                    nasNodeFootersStorage[id] = false;
                } else {
                    let childrenCount = getChildrenOnDisplayCount(id, display, hierarchyRelation, expandedItems);
                    elementsChildCountStorage[id] = childrenCount;
                    nasNodeFootersStorage[id] = (itemIndex > expandedItemIndex + childrenCount)
                }
            }
        }
    }
    
    for (let id in hasMoreStorage) {
        
        // Не считаю подвалы с кнопкой еще, если
        //      - узлу не надо рисовать подвал с кнопкой "Ещё", т.к. записей больше нет;
        //      - раскрытый узел - это узел для которого считаем номер строки;
        //      - узел и так раскрыт, а в дереве установлен шаблон для подвала узлов
        
        if (id !== itemId && hasMoreStorage[id] === true && !nasNodeFootersStorage.hasOwnProperty(id)) {
            
            let
                item = ItemsUtil.getDisplayItemById(display, id, idProperty),
                childrenCount;
            
            if (id in elementsChildCountStorage) {
                childrenCount = elementsChildCountStorage[id]
            } else {
                childrenCount = getChildrenOnDisplayCount(id, display, hierarchyRelation, expandedItems);
            }
            
            nasNodeFootersStorage[id] = (itemIndex > (display.getIndex(item) + childrenCount));
        }
    }
    
    return count + countTrue(nasNodeFootersStorage);
}

/**
 * Возвращает количество всех видимых подвалов узлов перед("выше") заданным элементом.
 *
 * @private
 */
// TODO: Переписать на рекурсию с запоминанием
function getChildrenOnDisplayCount(id, display, hierarchyRelation, expandedItems) {
    
    let count = 0, children;
    
    if (expandedItems[id]) {
        children = hierarchyRelation.getChildren(id, display.getCollection());
        count = children.length;

        children.forEach((item) => {
            count += getChildrenOnDisplayCount(item.getId(), display, hierarchyRelation, expandedItems);
        });
    }
    
    return count;
}


/**
 * Возвращает количество всех видимых подвалов узлов перед("выше") заданным элементом.
 *
 * @private
 */
function countTrue(obj: Record<string, boolean> = {}): number {
    return Object.keys(obj).reduce((acc, key) => {
        return acc + (obj[key] ? 1 : 0);
    }, 0);
}

// endregion