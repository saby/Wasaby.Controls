import * as rk from 'i18n!Controls';
import {Confirmation} from 'Controls/popup';
import {TKeysSelection, ISelectionObject} from 'Controls/interface';

/**
 * Базовый класс action'a, на основе которого создаются другие action'ы. Не подходит для самостоятельного использования.
 *
 * @class Controls/_list/BaseAction
 * @extends Core/Control
 * @control
 * @public
 * @author Герасимов А.М.
 */

export class ItemsValidator {
    /**
     * Производит проверку переданных параметров. Если массив значений пуст, возвращает false и выводит окно с текстом, иначе возвращает true.
     *
     * @remark
     * При необходимости метод нужно вызывать вручную из наследника.
     *
     * @function
     * @name Controls/_list/Validator#validate
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
