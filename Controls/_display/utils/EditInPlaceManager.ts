import CollectionItem from '../CollectionItem';

export default class EditInPlaceManager {
    private _editModeItem: CollectionItem<unknown>;
    private _isEditing: boolean = false;

    public beginEdit(item: CollectionItem<unknown>): void {
        if (item === this._editModeItem) {
            return;
        }
        if (this._editModeItem) {
            this._editModeItem.setEditing(false);
        }
        if (item) {
            item.setEditing(true);
        }
        this._editModeItem = item;
        this._isEditing = !!this._editModeItem;
    }

    public isEditing(): boolean {
        return this._isEditing;
    }
}
