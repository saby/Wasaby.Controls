import {Collection} from './../../display';
import CollectionItem from './../../_display/CollectionItem';
import {Record as TRecord} from "Types/entity";

type TKey = string;

type TBeforeBeginCallback = (params: {item: TRecord, isAdd: boolean}) => TBeforeBeginCallbackResult;
type TBeforeBeginCallbackSimpleResult = void | typeof CONSTANTS.CANCEL | TRecord;
type TBeforeBeginCallbackPromiseResult = Promise<TBeforeBeginCallbackSimpleResult>;
type TBeforeBeginCallbackResult = TBeforeBeginCallbackSimpleResult | TBeforeBeginCallbackPromiseResult;

export const CONSTANTS = {
    CANCEL: 'Cancel'
};

enum Errors {
    EDITING_ITEM_IS_MISSED_IN_COLLECTION,
    BEFORE_BEGIN_EDIT_RESULT_PROMISE_REJECTED,
    UNKNOWN_RETURN_TYPE_FROM_BEFORE_BEGIN_EDIT_CALLBACK
}

export interface IError {
    name: Errors,
    msg: typeof ErrorMessages[Errors],
    type: 'EditInPlace' | 'Other',
    native?: unknown
}

const ErrorMessages: Record<Errors, string> = {
    [Errors.EDITING_ITEM_IS_MISSED_IN_COLLECTION]: 'Элемент, для которого было запущено редактирование, должен присутствовать в коллекции.',
    [Errors.BEFORE_BEGIN_EDIT_RESULT_PROMISE_REJECTED]: 'Promise, который был возвращен из колбека beforeBeginEdit завершился с ошибкой.',
    [Errors.UNKNOWN_RETURN_TYPE_FROM_BEFORE_BEGIN_EDIT_CALLBACK]: 'Возвращаемое значение из колбека beforeBeginEdit должно иметь тип EditInPlaceController.TBeforeBeginCallbackResult.'
};

interface IEditableItem<T = unknown> extends CollectionItem<T> {
    readonly ['interface/IEditableItem']: true
}

interface IEditableCollection extends Collection<IEditableItem> {
    getKeyProperty(): string
}

interface IEditInPlaceControllerOptions {
    collection: IEditableCollection;
    addPosition?: 'begin' | 'end';
}

export type TEditInPlaceOperationResult = Promise<{status: 'canceled' | 'success', params: { item: TRecord}}>;



export class EditInPlaceController {
    private _options: IEditInPlaceControllerOptions;
    private _activeOperations: {
        edit?: TEditInPlaceOperationResult,
    } = {};


    constructor(options: IEditInPlaceControllerOptions) {
        this._options = {
            collection: options.collection
        };
    }

    private _edit(item: TRecord, beforeBeginCallback?: TBeforeBeginCallback): TEditInPlaceOperationResult {
        if (this._activeOperations.edit) {
            return this._activeOperations.edit;
        }

        let beforeBeginCallbackResult: TBeforeBeginCallbackResult;
        if (beforeBeginCallback) {
            beforeBeginCallbackResult = beforeBeginCallback({item});
        }

        this._activeOperations.edit = this._processBeginEdit(item, beforeBeginCallbackResult).finally(() => {
            this._activeOperations.edit = null;
        });

        return this._activeOperations.edit;
    }

    private _processBeginEdit(item: TRecord | undefined, beforeBeginCallbackResult?: TBeforeBeginCallbackResult) {
        const getError = (e: Errors, type: IError['type'], native?: unknown): IError => ({ name: e, msg: ErrorMessages[e], type, native});
        const hasItemInCollection = (curItem) => !!this._options.collection.getItemBySourceKey(curItem.get(this._options.collection.getKeyProperty()));

        const processIntoDeep = (result: TBeforeBeginCallbackResult) => {
            if (result === CONSTANTS.CANCEL) {
                return Promise.resolve({ status: 'canceled', params: { item } });
            } else if (isPromise<TBeforeBeginCallbackPromiseResult>(result)) {
                return result.then(
                    result => processIntoDeep(result),
                    reason => getError(Errors.BEFORE_BEGIN_EDIT_RESULT_PROMISE_REJECTED, 'Other', reason),
                )
            } else if (result && result instanceof TRecord) {
                if (hasItemInCollection(result)) {
                    return Promise.resolve({ status: 'success', params: { item: result } });
                } else {
                    return Promise.reject(getError(Errors.EDITING_ITEM_IS_MISSED_IN_COLLECTION, 'EditInPlace'))
                }
            } else if (typeof item === 'undefined') {
                return Promise.reject(getError(Errors.UNKNOWN_RETURN_TYPE_FROM_BEFORE_BEGIN_EDIT_CALLBACK, 'EditInPlace'))
            } else {
                return Promise.resolve({ status: 'success', params: { item } });
            }
        };

        return processIntoDeep(beforeBeginCallbackResult);
    }


    cancel(): TEditInPlaceOperationResult {

    }

    commit(): TEditInPlaceOperationResult {

    }

    isEditing(): boolean {
        return true;
    }


    //#region Перегрузка публичных методов

    edit(item: TRecord): TEditInPlaceOperationResult;
    edit(callback: TBeforeBeginCallback): TEditInPlaceOperationResult;
    edit(item: TRecord, callback: TBeforeBeginCallback): TEditInPlaceOperationResult;
    edit(itemOrCallback: TRecord | TBeforeBeginCallback, callback?: TBeforeBeginCallback): TEditInPlaceOperationResult {
        if (arguments.length === 2) {
            return this._edit(itemOrCallback as TRecord, callback);
        } else if (typeof itemOrCallback === 'function') {
            return this._edit(undefined, itemOrCallback);
        } else {
            return this._edit(itemOrCallback);
        }
    }

    //#endregion

}

function isPromise<TPromise = Promise<unknown>>(expected: unknown): expected is TPromise {
    return expected && expected.finally;
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


