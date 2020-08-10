export interface ICollectionOfEditingObjects {
    _isEditing: boolean;

    isEditing(): boolean;
    setEditing(isEditing: boolean): void;
}
