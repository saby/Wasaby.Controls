import ItemsUtil = require('Controls/_list/resources/utils/ItemsUtil')
import {relation} from 'Types/entity'
import { Collection, CollectionItem } from 'Types/display'


/**
 * @author Rodionov E.A.
 */


/**
 * @typedef {String} ResultsPosition
 * @variant top Результаты выводятся сверху таблицы.
 * @variant bottom Результаты выводятся снизу таблицы.
 */
type ResultsPosition = 'top'|'bottom';

type DItem = CollectionItem<unknown>;
type Display = Collection<unknown, DItem>;

type HasMoreStorage = {[key: string]: boolean};
type ExpandedItems = {[key: string]: boolean};



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

function calcNodeFootersBeforeItem(display: Display,
                                   itemId: string,
                                   itemIndex: number,
                                   hierarchyRelation: relation.Hierarchy,
                                   hasMoreStorage: HasMoreStorage,
                                   expandedItems: ExpandedItems,
                                   hasNodeFooterTemplate: boolean): number {
    
    let
        count = 0,
        itemsFooterStatuses: {[parentId: string]: boolean} = {},
        elementsChildrenCount: {[parentId: string]: number} = {},
        idProperty:string = display.getIdProperty() || display.getCollection().getIdProperty();
    
    if (hasNodeFooterTemplate) {
        for (let id in expandedItems) {
            if (id !== itemId) {
                let
                    expandedItem = ItemsUtil.getDisplayItemById(display, id, idProperty),
                    expandedItemIndex = display.getIndex(expandedItem);
                
                if (expandedItemIndex >= itemIndex) {
                    itemsFooterStatuses[id] = false;
                } else {
                    let childrenCount = getChildrenOnDisplayCount(id, display, hierarchyRelation, expandedItems);
                    elementsChildrenCount[id] = childrenCount;
                    itemsFooterStatuses[id] = (itemIndex > expandedItemIndex + childrenCount)
                }
            }
        }
    }
    
    for (let id in hasMoreStorage) {
        
        // Не считаю подвалы с кнопкой еще, если
        //      - узлу не надо рисовать подвал с кнопкой "Ещё", т.к. записей больше нет;
        //      - раскрытый узел - это узел для которого считаем номер строки;
        //      - узел и так раскрыт, а в дереве установлен шаблон для подвала узлов
        
        if (id !== itemId && hasMoreStorage[id] === true && !itemsFooterStatuses.hasOwnProperty(id)) {
            
            let
                item = ItemsUtil.getDisplayItemById(display, id, idProperty),
                childrenCount;
    
            if (id in elementsChildrenCount) {
                childrenCount = elementsChildrenCount[id]
            } else {
                childrenCount = getChildrenOnDisplayCount(id, display, hierarchyRelation, expandedItems);
            }
            
            itemsFooterStatuses[id] = (itemIndex > (display.getIndex(item) + childrenCount));
        }
    }
    
    return count + countTrue(itemsFooterStatuses);
}

// TODO: Переписать на рекурсию с запоминанием
function getChildrenOnDisplayCount(id, display, hierarchyRelation, expandedItems) {
    
    let count = 0, children;
    
    if (expandedItems[id]) {
        children = hierarchyRelation.getChildren(id, display.getCollection());
        count = children.length;
        if (children.length !== 0) {
            children.forEach((item)=>{
                count += getChildrenOnDisplayCount(item.getId(), display, hierarchyRelation, expandedItems);
            });
        }
    }
    
    return count;
}


function countTrue(obj: { [key: string]: boolean } = {}): number {
    let count = 0;
    for (let key in obj) {
        count += obj[key] ? 1 : 0;
    }
    return count;
}

export {
    getIndexById,
    getIndexByItem,
    getIndexByDisplayIndex
}