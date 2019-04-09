import ItemsUtil = require("Controls/_lists/resources/utils/ItemsUtil");


enum ResultsPosition {
    Top = 'top',
    Bottom = 'bottom'
}

function calcRowIndexByKey(
    key: string|number,
    display,
    hasHeader: boolean = false,
    resultsPosition: ResultsPosition|string|null = null,
    hierarchyRelation?,
    hasMoreStorage?
): number {

    let
        rowTopOffset: number = calcTopOffset(hasHeader, resultsPosition),
        keyProperty: string = display.getCollection().getIdProperty(),
        item = ItemsUtil.getDisplayItemById(display, key, keyProperty),
        itemIndex: number = display.getIndexBySourceItem(item.getContents());

    if (!hierarchyRelation || !hasMoreStorage) {
        return rowTopOffset + itemIndex;
    }

    return rowTopOffset + itemIndex + _calcHasMoreButtonsBefore(itemIndex, display, hasMoreStorage, hierarchyRelation);
}

function calcResultsRowIndex(
    display,
    resultsPosition: ResultsPosition|string|null = null,
    hasHeader: boolean = false,
    hasFooterTemplate: boolean = false,
    hierarchyRelation?,
    hasMoreStorage?
): number {

    let offsetForHeader = hasHeader ? 1 : 0;

    if (resultsPosition === ResultsPosition.Top) {
        return offsetForHeader;
    }

    let
        lastItem = ItemsUtil.getLastItem(display),
        lastRowIndex = calcRowIndexByKey(lastItem.getId(), display, hasHeader, resultsPosition, hierarchyRelation, hasMoreStorage);

    return lastRowIndex + offsetForHeader + (hasFooterTemplate ? 1 : 0);
}

function calcGroupRowIndex(groupItem, display, hasRelations, hasHeader, resultsPosition, hasMoreStorage?, hierarchyRelation?): number {
    let index = display.getIndex(groupItem);
    return _calcRowIndexByDisplayIndex(index, display, hasRelations, hasHeader, resultsPosition, hasMoreStorage, hierarchyRelation);
}

function calcTopOffset(
    hasHeader: boolean = false,
    resultsPosition?: ResultsPosition|string|null,
): number {

    let offset = 0;

    if (hasHeader) {
        offset++;
    }

    if(resultsPosition && resultsPosition === ResultsPosition.Top) {
        offset++;
    }

    return offset;
}

function _calcRowIndexByDisplayIndex(
    index: number,
    display,
    hasRelations: boolean = false,
    hasHeader: boolean = false,
    resultsPosition: ResultsPosition|string|null = null,
    hasMoreStorage?,
    hierarchyRelation?
): number {
    let rowTopOffset: number = calcTopOffset(hasHeader, resultsPosition);

    if (!hasMoreStorage || !hierarchyRelation) {
        return index + rowTopOffset;
    }

    return rowTopOffset + index + _calcHasMoreButtonsBefore(index, display, hasMoreStorage, hierarchyRelation);
}

function _calcHasMoreButtonsBefore(itemIndex: number, display, hasMoreStorage, hierarchyRelation): number{
    let
        count = 0,
        keyProperty: string = display.getCollection().getIdProperty();

    for (let key in hasMoreStorage) {

        let
            item = ItemsUtil.getDisplayItemById(display, key, keyProperty),
            childsCount = hierarchyRelation.getChildren(key, display.getCollection()).length;

        if (itemIndex > display.getIndex(item) + childsCount) {
            count++;
        }
    }
    return count;
}

export {
    ResultsPosition,
    calcRowIndexByKey,
    calcResultsRowIndex,
    calcGroupRowIndex,
    calcTopOffset
}



