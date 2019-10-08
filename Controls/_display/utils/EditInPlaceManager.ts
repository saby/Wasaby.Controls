import BaseManager from './BaseManager';

export interface IEditInPlaceManageableItem {
    setEditing(editing: boolean, editingContents?: unknown): void;
}

export default class EditInPlaceManager extends BaseManager {
    protected _editModeItem: IEditInPlaceManageableItem;

    beginEdit(item: IEditInPlaceManageableItem, editingContents?: unknown): void {
        if (item === this._editModeItem) {
            return;
        }
        this.endEdit();
        if (item) {
            item.setEditing(true, editingContents);
            this._editModeItem = item;
        }
    }

    endEdit(): void {
        if (this._editModeItem) {
            this._editModeItem.setEditing(false, null);
            this._editModeItem = null;
        }
    }

    isEditing(): boolean {
        return !!this._editModeItem;
    }
}
