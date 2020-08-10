interface IEditableItem {
    isEditing(): boolean
    setIsEditing(): boolean
}

interface IEditableCollection {
    setEditing(item, isEditing): void
    isEditing(): boolean
    setIsEditing(): boolean
}

class EditInPlaceController {
    private _editingItem: IEditableItem;
    private _originItem: IEditableItem;

    isEditing(): boolean {
        return this._
    }
    edit(item, params) {}
    commit() {}
    cancel() {}
}



function edit(item, params) {
    if (!hasItemInCollection(item)) {
        this._isAdd = true;
        this._editingItem = item;
    }

    if (this._isAdd) {
        this._insertItem(item, params);
    } else {
        this._originItem = item;
    }

    this.setEditing(item, true);
}

function commit() {
    this._editingItem.acceptChanges();
    this.resetState();
}

function cancel() {
    if (this._isAdd) {
        this._removeItem(this._editingItem);
    } else {
        this._editingItem.resetChanges();
    }
    this.resetState();
}
