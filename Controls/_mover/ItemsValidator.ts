import * as rk from 'i18n!Controls';
import {Confirmation} from 'Controls/popup';
import {TKeysSelection, ISelectionObject} from 'Controls/interface';

/**
 * Валидатор записей для перемещения/удаления
 *
 * @class Controls/_mover/Validator
 * @extends Core/Control
 * @control
 * @public
 * @author Аверкиев П.А.
 */

export class ItemsValidator {
    /**
     * Производит проверку переданных параметров. Если массив значений пуст, возвращает false и выводит окно с текстом, иначе возвращает true.
     *
     * @remark
     * При необходимости метод нужно вызывать вручную из наследника.
     *
     * @function
     * @name Controls/_mover/Validator#validate
     */
    static validate(items: ISelectionObject|TKeysSelection): boolean {
        let resultValidate: boolean = true;

        if (items instanceof Array && !items.length || (items as ISelectionObject).selected && !(items as ISelectionObject).selected.length) {
            resultValidate = false;
            Confirmation.openPopup({
                type: 'ok',
                message: rk('Нет записей для обработки команды')
            });
        }

        return resultValidate;
    }
}
