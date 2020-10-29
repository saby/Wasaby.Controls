import {ICrud, ICrudPlus, SbisService} from 'Types/source';
import { Record } from 'Types/entity';
import { ISelectionObject } from 'Controls/interface';
import {Confirmation, IBasePopupOptions} from 'Controls/popup';
import { Logger } from 'UI/Utils';
import * as rk from 'i18n!*';

// @todo https://online.sbis.ru/opendoc.html?guid=2f35304f-4a67-45f4-a4f0-0c928890a6fc
type TSource = SbisService|ICrudPlus;

/**
 * Интерфейс опций контроллера
 * @interface Controls/_list/Controllers/RemoveController/IRemoveControllerOptions
 * @public
 * @author Аверкиев П.А.
 */
export interface IRemoveControllerOptions {
    /**
     * @name Controls/_list/interface/IRemoveControllerOptions#source
     * @cfg {TSource} Источник данных, в котором производится удаление
     */
    source: TSource;
}

/**
 * Контроллер для удаления элементов списка в dataSource.
 *
 * @class Controls/_list/Controllers/RemoveController
 * @public
 * @author Аверкиев П.А.
 */
export class RemoveController {
    private _source: TSource;

    constructor(options: IRemoveControllerOptions) {
        this.updateOptions(options);
    }

    /**
     * Обновляет поля контроллера
     * @function Controls/_list/Controllers/RemoveController#updateOptions
     */
    updateOptions(options: IRemoveControllerOptions): void {
        this._source = options.source;
    }

    /**
     * Удаляет элементы из источника данных без подтверждения
     * @function Controls/_list/Controllers/RemoveController#remove
     * @param {Controls/interface:ISelectionObject} selection Массив элементов для удаления.
     * @returns {Promise}
     */
    remove(selection: ISelectionObject): Promise<void> {
        return this._removeFromSource(selection);
    }

    /**
     * Удаляет элементы из источника данных c подтверждением удаления
     * @function Controls/_list/Controllers/RemoveController#removeWithConfirmation
     * @param {Controls/interface:ISelectionObject} selection Массив элементов для удаления.
     * @returns {Promise}
     */
    removeWithConfirmation(selection: ISelectionObject): Promise<void> {
        return Confirmation.openPopup({
            type: 'yesno',
            style: 'danger',
            message: rk('Удалить выбранные записи?')
        }).then((result) => result ? this._removeFromSource(selection) : Promise.reject());
    }

    private _removeFromSource(selection: ISelectionObject): Promise<void> {
        const error: string = RemoveController._validateBeforeRemove(this._source, selection);
        if (error) {
            Logger.error(error);
            return Promise.reject(new Error(error));
        }
        /**
         * https://online.sbis.ru/opendoc.html?guid=2f35304f-4a67-45f4-a4f0-0c928890a6fc
         * При использовании ICrudPlus.destroy() мы не можем передать filter и folder_id, т.к. такой контракт
         * не соответствует стандартному контракту SbisService.move(). Поэтому здесь вызывается call
         */
        if ((this._source as SbisService).call) {
            const source: SbisService = this._source as SbisService;
            return new Promise((resolve) => {
                import('Controls/operations').then((operations) => {
                    const sourceAdapter = source.getAdapter();
                    const callFilter = {
                        selection: operations.selectionToRecord(selection, sourceAdapter)
                    };
                    source.call(source.getBinding().destroy, {
                        method: source.getBinding().list,
                        filter: Record.fromObject(callFilter, sourceAdapter)
                    }).then(() => {
                        resolve();
                    });
                });
            });
        }
        return this._source.destroy(selection.selected);
    }

    private static _validateBeforeRemove(source: ICrud, selection: ISelectionObject): string {
        let error;
        if (!source) {
            error = 'RemoveController: Source is not set';
        }
        if (!selection || (!selection.selected && !selection.excluded)) {
            error = 'RemoveController: Selection type must be Controls/interface:ISelectionObject';
        }
        return error;
    }
}
