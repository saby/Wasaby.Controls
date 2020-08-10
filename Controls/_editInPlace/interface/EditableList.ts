import {IEditingController} from './IEditingController';
import {IEditingObject} from './IEditingObject';
import {ICrudPlus} from '../../../application/Types/source';
import {TCRUDOperationResult} from './Types';



abstract class EditableList {

    public abstract getEditingController(): IEditingController;

    public abstract beginEdit(key: string);

    public abstract beginAdd(newItem?: IEditingObject): TCRUDOperationResult;

    public abstract commitEdit(): TCRUDOperationResult;
    public abstract cancelEdit(): TCRUDOperationResult;
}

/*
* abstract class EditableList {

    public abstract getEditingController(): IEditingController;

    public abstract editItem(item: IEditingObject);
    public abstract editItem(key: string);

    public abstract editNewItem(): TCRUDOperationResult;
    public abstract editNewItem(newItem: IEditingObject): TCRUDOperationResult;

    public abstract commitEdit(): TCRUDOperationResult;
    public abstract cancelEdit(): TCRUDOperationResult;
}
* */



class BaseControl extends EditableList {

    beginAdd(newItem?: IEditingObject): TCRUDOperationResult {
        return this.getEditingController().beginAdd(newItem, () => {
            return this._notify('beforeBeginEdit');
        }).then((result) => {
            if (result.status === "success") {
                this._notify('afterBeginEdit');
            }
            return result;
        });
    }

    beginEdit(itemOrKey) {
        this.getEditingController().beginEdit(itemOrKey, () => {
            return this._notify('beforeBeginEdit');
        }).then((result) => {
            if (result.status === "success") {
                this._notify('afterBeginEdit');
            }
            return result;
        })
    }

    commitEdit(): TCRUDOperationResult  {
        this._showIndicator('all');
        return this.getEditingController().commit().then((result) => {
            this._hideIndicator();
            return result;
        });
    }


    /* Не относится к редактированию напрямую */

    // Нужно написать индикатор так, чтоб он замораживал реестр по истечению 2х секунд
    _showIndicator(direction: 'all') {}
    _hideIndicator() {},
    _notify(eventName) {}
}

const baseControl = new BaseControl();
