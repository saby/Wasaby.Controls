import Collection from '../Collection';
import { updateCollectionWithCachedItem, getItemByKey } from './controllerUtils';

export interface IEditInPlaceItem {
    setEditing(editing: boolean, editingContents?: unknown): void;
    isEditing(): boolean;
}

const CACHE_EDIT_MODE_ITEM = 'editModeItem';

export function beginEdit(collection: Collection<unknown>, key: string|number, editingContents?: unknown): void {
    updateCollectionWithCachedItem(collection, CACHE_EDIT_MODE_ITEM, (oldEditItem: IEditInPlaceItem) => {
        const newEditItem: IEditInPlaceItem = getItemByKey(collection, key);

        if (oldEditItem) {
            oldEditItem.setEditing(false);
        }
        if (newEditItem) {
            newEditItem.setEditing(true, editingContents);
        }

        return newEditItem;
    });
}

export function endEdit(collection: Collection<unknown>): void {
    beginEdit(collection, null);
}

export function isEditing(collection: Collection<unknown>): boolean {
    return !!collection.getCacheValue(CACHE_EDIT_MODE_ITEM);
}
