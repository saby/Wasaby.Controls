import { ICrud } from 'Types/source';
import { ISelectionObject } from 'Controls/interface';
import { Confirmation } from 'Controls/popup';
import { Logger } from 'UI/Utils';
import * as rk from 'i18n!*';

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
    source: ICrud;
}

/**
 * Контроллер для удаления элементов списка в dataSource.
 *
 * @class Controls/_list/Controllers/RemoveController
 * @public
 * @author Аверкиев П.А.
 */
export class RemoveController {
    private _source: ICrud;

    constructor(options: IRemoveControllerOptions) {
        this.updateOptions(options);
    }

    /**
     * Обновляет поля контроллера
     * @function Controls/_list/Controllers/RemoveController#updateOptions
     * @param {IRemoveControllerOptions} options источник данных
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
