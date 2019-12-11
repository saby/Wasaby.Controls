import Collection from '../Collection';
import { updateCollectionWithCachedItem, getItemByKey } from './controllerUtils';

export interface ISwipeItem {
    setSwiped(swiped: boolean): void;
    isSwiped(): boolean;
}

const CACHE_SWIPED_ITEM = 'swipedItem';

export function setSwipeItem(collection: Collection<unknown>, key: string|number): void {
    updateCollectionWithCachedItem(collection, CACHE_SWIPED_ITEM, (oldSwipedItem: ISwipeItem) => {
        const newSwipedItem: ISwipeItem = getItemByKey(collection, key);

        if (oldSwipedItem) {
            oldSwipedItem.setSwiped(false);
        }
        if (newSwipedItem) {
            newSwipedItem.setSwiped(true);
        }

        return newSwipedItem;
    });
}

export function getSwipeItem(collection: Collection<unknown>): ISwipeItem {
    return collection.getCacheValue(CACHE_SWIPED_ITEM);
}
