import {CONSTANTS, EditInPlaceController, IError, TEditInPlaceOperationResult} from "./EditInPlaceController";
import {Collection} from './../../display';
import {Record} from 'Types/entity';
import {Memory, ICrud} from './../../../application/Types/source';

type TItem = {id: string, title: string}

const ITEMS: TItem[] = [{id: '1', title: 'one'}, {id: '2', title: 'two'}];

export class BaseControl {
    private _editInPlace: EditInPlaceController;
    private _sourceController: ICrud;

    private _collection: Collection<TItem>;

    private _getEditInPlace(): EditInPlaceController {
        if (!this._editInPlace) {
            this._editInPlace = new EditInPlaceController({
                collection: this._collection
            });
        }
        return this._editInPlace;
    }

    private _getSourceController(): ICrud {
        if (!this._sourceController) {
            this._sourceController = new Memory({
                keyProperty: 'id',
                data: ITEMS
            });
        }
        return this._sourceController;
    }

    private _getErrorController(): {process: (...args: unknown[]) => void} {
        return {
            process: (...args: unknown[]) => {}
        }
    }

    private _getMarkerController(): {update: (markedKey: string) => void} {
        return {
            update: (markedKey: string) => {}
        }
    }

    constructor() {
        this._collection = new Collection({
            keyProperty: 'id',
            collection: ITEMS
        });
    }


    beginEdit(options: {item: Record}): TEditInPlaceOperationResult {
        return this._beginEdit(options, (params) => {
            this._notify('beforeBeginEdit', [params.item, false])
        }, false);
    }


    beginAdd(options: {item?: Record}): TEditInPlaceOperationResult {
        return this._beginEdit(options, (params) => {
            const result = this._notify('beforeBeginEdit', [params.item, true]);
            const needCreateItem = (result !== CONSTANTS.CANCEL) && !item && !result;
            return needCreateItem ? this._createItem() : result;
        }, true);
    }


    private _beginEdit(options: {item: Record}, beforeCallback, isAdd: boolean): TEditInPlaceOperationResult {
        const eip = this._getEditInPlace();
        const isEditing = eip.isEditing();
        this._showIndicator();

        return this._validate().then(() => {
            return eip.commit().then((commitResult) => {
                if (commitResult.status === CONSTANTS.CANCEL) {
                    return {cancelled: true}
                } else if (isEditing) {
                    this._notify('afterEndEdit', [commitResult.params.item, commitResult.params.isAdd]);
                }

                return eip.edit(options.item, (params) => {
                    return beforeCallback(params);
                }).then((result) => {
                    if (result.status === 'success') {
                        this._notify('afterBeginEdit', [result.params.item, isAdd]);
                    } else {
                        this._getMarkerController().update(result.params.item.getKey());
                    }
                })
            }).catch((error: IError) => {
                this._getErrorController().process(error.msg, 'theme-default');
            });
        }).finally(() => {
            this._hideIndicator();
        })
    }


















    beginAdd(options: { item: Record }) {
        const eip = this._getEditInPlace();
        const isEditing = eip.isEditing();

        const startPromise: Promise<unknown> = isEditing ?
            EditInPlaceNotifyUtil.wrapResultIntoPromise(this._notify('beforeEndEdit')) : Promise.resolve();

        startPromise.then(() => {
            this._validationController.validate().then(() => {
                eip.commit().then(() => {
                    if (isEditing) {
                        this._notify('afterEndEdit');
                    }
                    EditInPlaceNotifyUtil.wrapResultIntoPromise(this._notify('beforeBeginEdit')).then((item?: Record) => {
                        Promise.resolve(item || options.item || this._createItem()).then((item) => {
                            eip.add(item).then((addResult) => {
                                eip.edit(addResult.item).then((beginEditResult) => {
                                    this._notify('afterBeginEdit');
                                })
                            })
                        })
                    });
                });
            })
        });
    }








    private _showIndicator() {}
    private _hideIndicator() {}
    private _notify(eName, args?: unknown[]) {}
    private _validate(): Promise<unknown>;
}

const EditInPlaceNotifyUtil = {
    wrapResultIntoPromise(notifyResult: undefined | Record | 'Cancel' | Promise<undefined | Record | 'Cancel'>) {
        const processIntoDeep = (result) => {
            if (result === 'Cancel') {
                return Promise.reject();
            } else if (result && result.finally) {
                return result.then(result => processIntoDeep(result));
            } else if (result && result instanceof Record) {
                return Promise.resolve(result);
            } else {
                return Promise.resolve();
            }
        };
        return processIntoDeep(notifyResult);
    }
};
