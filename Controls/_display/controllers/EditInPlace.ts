import { TItemKey, IBaseCollection } from '../interface';

export interface IEditInPlaceItem {
    setEditing(editing: boolean, editingContents?: unknown): void;
    isEditing(): boolean;
}

export type IEditInPlaceCollection = IBaseCollection<IEditInPlaceItem>;

export function beginEdit(
    collection: IEditInPlaceCollection,
    key: TItemKey,
    editingContents?: unknown
): void {
    const oldEditItem = getEditedItem(collection);
    const newEditItem = collection.getItemBySourceKey(key);

    if (oldEditItem) {
        oldEditItem.setEditing(false);
    }
    if (newEditItem) {
        newEditItem.setEditing(true);
    }

    collection.nextVersion();
}

export function endEdit(collection: IEditInPlaceCollection): void {
    beginEdit(collection, null);
}

export function isEditing(collection: IEditInPlaceCollection): boolean {
    return !!getEditedItem(collection);
}

export function getEditedItem(collection: IEditInPlaceCollection): IEditInPlaceItem {
    return collection.find((item) => item.isEditing());
}
