import { IBaseCollection, TItemKey } from './interface';

export interface IMarkerItem {
    setMarked(marked: boolean): void;
    isMarked(): boolean;
}

export type IMarkerCollection = IBaseCollection<IMarkerItem>;

export function markItem(
    collection: IMarkerCollection,
    key: TItemKey
): void {
    const oldMarkedItem = getMarkedItem(collection);
    const newMarkedItem = collection.getItemBySourceKey(key);

    if (oldMarkedItem) {
        oldMarkedItem.setMarked(false);
    }
    if (newMarkedItem) {
        newMarkedItem.setMarked(true);
    }

    collection.nextVersion();
}

export function getMarkedItem(collection: IMarkerCollection): IMarkerItem {
    return collection.find((item) => item.isMarked());
}
