import Collection from '../Collection';
import { getItemByKey, updateCollectionWithCachedItem } from './controllerUtils';

export interface IMarkerItem {
    setMarked(marked: boolean): void;
    isMarked(): boolean;
}

const CACHE_MARKED_ITEM = 'markedItem';

export function markItem(collection: Collection<unknown>, key: number|string): void {
    updateCollectionWithCachedItem(collection, CACHE_MARKED_ITEM, (oldMarkedItem: IMarkerItem) => {
        const newMarkedItem: IMarkerItem = getItemByKey(collection, key);

        if (oldMarkedItem) {
            oldMarkedItem.setMarked(false);
        }
        if (newMarkedItem) {
            newMarkedItem.setMarked(true);
        }

        return newMarkedItem;
    });
}

export function getMarkedItem(collection: Collection<unknown>): void {
    return collection.getCacheValue(CACHE_MARKED_ITEM);
}
