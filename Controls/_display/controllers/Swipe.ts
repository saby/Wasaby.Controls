import { IBaseCollection, TItemKey } from '../interface';

export interface ISwipeItem {
    setSwiped(swiped: boolean): void;
    isSwiped(): boolean;
}

export type ISwipeCollection = IBaseCollection<ISwipeItem>;

export function setSwipeItem(
    collection: ISwipeCollection,
    key: TItemKey
): void {
    const oldSwipeItem = getSwipeItem(collection);
    const newSwipeItem = collection.getItemBySourceKey(key);

    if (oldSwipeItem) {
        oldSwipeItem.setSwiped(false);
    }
    if (newSwipeItem) {
        newSwipeItem.setSwiped(true);
    }

    collection.nextVersion();
}

export function getSwipeItem(collection: ISwipeCollection): ISwipeItem {
    return collection.find((item) => item.isSwiped());
}
