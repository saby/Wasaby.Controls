import {TCRUDOperationResult} from './Types';
import {ICrud} from './../../../application/Types/source';
import {ICollectionOfEditingObjects} from './IEditingObjectsCollection';
import {IEditingObject} from "./IEditingObject";

interface IEditingControllerOptions {
    editOnClick?: boolean;

    editableCollection: ICollectionOfEditingObjects;
    source?: ICrud;

    /*
    * Для прикладников. Стреляет до попытки начать редактирование. Вернуться может:
    *   - ничего: начнем редактирование/добавление;
    *   - CANCEL: не начнем редактирование. Например, не прошла прикладная валидация на сервере.
    *   - Promise. Ждем его результата. Может вернуть:
    *          - ничего
    *
    * */

    onBeforeBeginEdit?();
    onAfterBeginEdit?();
    onBeforeEndEdit?();
    onBeforeEndEdit?();
}


export abstract class IEditingController {
    _options: IEditingControllerOptions;

    abstract isEditing(): boolean;

    public beginAdd(item?: IEditingObject, beforeBeginAddCallback?): TCRUDOperationResult {
        let resolve, reject;
        const resultPromise: TCRUDOperationResult = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        // Закрыли прошлое
        // Если успешно, то вызываем beforeBeginAddCallback.
        let callbackResult;
        if (beforeBeginAddCallback) {
            callbackResult = beforeBeginAddCallback();
        }

        new Promise<IEditingObject>((res, rej) => {
            if (callbackResult === 'Cancel') {
                // Передаем "denied"
            }
            if (typeof item !== "undefined") {
                res(item);
            } else if (this._options.source) {
                this._options.source.create().then((createdRecord) => {
                    resolve(createdRecord as unknown as IEditingObject);
                });
            } else {
                reject();
            }
        }).then((newItem) => {
            return 'success';
        }).catch(() => {
            reject();
        });

        return resultPromise;
    };
    public beginEdit(key, beforeBeginEditCallback?): TCRUDOperationResult;

    abstract commit(): TCRUDOperationResult;
    abstract cancel(): TCRUDOperationResult;


    // Точно ли не промис возвращать?
    abstract destroy(): void;
}


/*
*  public beginEdit(): Promise<unknown> {
        return new Promise((resolve, reject) => {
            // Запускаем
        }).then(() => {
            this._options.editableCollection.setEditing(true);
            this._options.onAfterBeginEdit();
        }).catch(() => {
            this._options.editableCollection.setEditing(false);
        }).finally(() => {
            return
        });
    };
* */
