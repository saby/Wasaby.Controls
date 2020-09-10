import { ICrud } from 'Types/source';
import { ISelectionObject } from 'Controls/interface';
import { Confirmation } from 'Controls/popup';
import rk from "i18n!*";

/**
 * Контроллер для удаления элементов списка в dataSource.
 *
 * @class Controls/_list/Controllers/RemoveController
 * @public
 * @author Аверкиев П.А.
 */
export class RemoveController {
    private _source: ICrud;

    constructor(source: ICrud) {
        this.updateOptions(source);
    }

    /**
     * Обновляет поля контроллера
     * @function Controls/_list/Controllers/RemoveController#updateOptions
     * @param {Types/source:ICrud} source
     */
    updateOptions(source: ICrud): void {
        this._source = source;
    }

    /**
     * Удаляет элементы из источника данных без подтверждения
     * @function Controls/_list/Controllers/RemoveController#removeItems
     * @param {Controls/interface:ISelectionObject} items Массив элементов для удаления.
     * @returns {Promise}
     */
    removeItems(items: ISelectionObject): Promise<void> {
        return this._removeFromSource(items);
    }

    /**
     * Удаляет элементы из источника данных c подтверждением удаления
     * @function Controls/_list/Controllers/RemoveController#removeItemsWithConfirmation
     * @param {Controls/interface:ISelectionObject} items Массив элементов для удаления.
     * @returns {Promise}
     */
    removeItemsWithConfirmation(items: ISelectionObject): Promise<void> {
        return new Promise((resolve) => {
            Confirmation.openPopup({
                type: 'yesno',
                style: 'danger',
                message: rk('Удалить выбранные записи?')
            }).then((result) => {
                if (result) {
                    this._removeFromSource(items).then(() => resolve());
                }
            });
        });
    }

    private _removeFromSource(items: ISelectionObject): Promise<void> {
        return this._source.destroy(items.selected);
    }
}
