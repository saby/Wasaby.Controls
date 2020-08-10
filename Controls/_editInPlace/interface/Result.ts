import {ICrud} from "../../../application/Types/source";

class EditingPromise<T> extends Promise<T> {
    _isAborted: boolean;

    then(onfulfilled, onrejected) {
        return super.then(
            value => {
                if (!this._isAborted) {
                    onfulfilled(value);
                }
            },
            reason => {
                if (!this._isAborted) {
                    onrejected(reason);
                }
            }
        );
    }

    public abort() {
        this._isAborted = true;
    }
}
type TCRUDOperationResult = EditingPromise<{ status: 'success' | 'cancelled' | 'error'}>;


/* Опции базового контроллера */
interface IEditInPlaceControllerOptions {
    collection: IEditingObjectsCollection;
    source?: ICrud;

    addPosition?: 'begin' | 'end';
}

/* Контроллер редактирования по месту элементов коллекции */
interface IEditInPlaceController<T extends IEditInPlaceControllerOptions = IEditInPlaceControllerOptions> {
    _options: T;

    updateOptions(options: T): void;

    edit(key, beforeBeginEditCallback?): TCRUDOperationResult;
    add(item?: IEditingObject, beforeBeginAddCallback?, itemIndex?: number): TCRUDOperationResult

    //beginAdd(params?: { item?: IEditingObject, itemIndex?: number, beforeBeginAddCallback? }): TCRUDOperationResult

    commit(autoAdd?: boolean): TCRUDOperationResult;
    cancel(): TCRUDOperationResult;

    destroy(): void;
}

/* Опции контроллера редактирования по месту элементов списка */
interface IListEditInPlaceControllerOptions extends IEditInPlaceControllerOptions {
    sequentialEditing?: boolean;
    item?: IEditingObject;
    autoAddConfig?: {
        byCommitItemAction?: boolean;
        byTab?: boolean;
        byEnter?: boolean;
    };
}

/* Контроллер редактирования по месту элементов списка */
interface IListEditInPlaceController extends IEditInPlaceController<IListEditInPlaceControllerOptions> {
    handleKeyDown(keyCodes: number[]): TCRUDOperationResult;
}


































interface IEditableListOptions {
    item?: IEditingObject;
    editOnClick?: boolean;
}
interface IEditableList {
    _options: IEditableListOptions;

    getEditingController(): IEditingController;

    beginEdit(key: string);
    beginAdd(newItem?: IEditingObject): TCRUDOperationResult;

    commitEdit(): TCRUDOperationResult;
    cancelEdit(): TCRUDOperationResult;
}


export interface IEditableItem {
    isEditing(): boolean;
    setIsEditing(isEditing: boolean): void;


    // Помечается нереальный элемент. Например добавляемая запись.
    // Мы начинаем добавление, добавляем запись в модель.
    // При отмене удаления или разрушении контроллера, нужно удалить его.
    isAdding(): boolean;
    setIsAdding(isAdding: boolean): void;
    // itemsStrategy, кнопка в корень Mover.
}

export interface IEditingObjectsCollection {
    isEditing(): boolean;
    setEditing(isEditing: boolean): void; // key
}








