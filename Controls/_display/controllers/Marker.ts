import {
    getItemByKey,
    updateCollectionWithCachedItem,
    IBaseCollection,
    TCollectionKey
} from './controllerUtils';

export interface IMarkerItem {
    setMarked(marked: boolean): void;
    isMarked(): boolean;
}

const CACHE_MARKED_ITEM = 'markedItem';

export function markItem(
    collection: IBaseCollection,
    key: TCollectionKey
): void {
    updateCollectionWithCachedItem(
        collection,
        CACHE_MARKED_ITEM,
        (oldMarkedItem: IMarkerItem) => {
            const newMarkedItem: IMarkerItem = getItemByKey(collection, key);

            if (oldMarkedItem) {
                oldMarkedItem.setMarked(false);
            }
            if (newMarkedItem) {
                newMarkedItem.setMarked(true);
            }

            return newMarkedItem;
        }
    );
}

export function getMarkedItem(collection: IBaseCollection): IMarkerItem {
    return collection.getCacheValue(CACHE_MARKED_ITEM) as IMarkerItem;
}
