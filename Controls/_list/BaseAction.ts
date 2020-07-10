import Control = require('Core/Control');
import rk = require('i18n!Controls');
import {Confirmation} from 'Controls/popup';
import {ISelectionObject} from 'Controls/interface';

/**
 * Контрол, на основе которого можно создавать другие action'ы.
 * 
 * @remark
 * Посредством метода validate реализует валидацию. Не подходит для самостоятельного использования.
 *
 * @class Controls/_list/BaseAction
 * @extends Core/Control
 * @control
 * @public
 * @author Герасимов А.М.
 */

export default Control.extend({
    /**
     * Запускает валидацию.
     * @function
     * @name Controls/_list/BaseAction#validate
     */
   validate(items: Array|ISelectionObject): boolean {
      let resultValidate: boolean = true;

      if (items instanceof Array && !items.length || items.selected && !items.selected.length) {
         resultValidate = false;
         Confirmation.openPopup({
            type: 'ok',
            message: rk('Нет записей для обработки команды')
         });
      }

      return resultValidate;
   }
});
