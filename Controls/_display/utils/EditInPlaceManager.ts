import CollectionItem from '../CollectionItem';

export default class EditInPlaceManager {
    private _editModeItem: CollectionItem<unknown>;
    private _isEditing: boolean = false;

    beginEdit(item: CollectionItem<unknown>, editingContents: unknown): void {
        if (item === this._editModeItem) {
            return;
        }
        if (this._editModeItem) {
            this._editModeItem.setEditing(false, null);
        }
        if (item) {
            item.setEditing(true, editingContents);
        }
        this._editModeItem = item;
        this._isEditing = !!this._editModeItem;
    }

    isEditing(): boolean {
        return this._isEditing;
    }
}
