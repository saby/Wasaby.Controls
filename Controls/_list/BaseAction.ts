import rk = require('i18n!Controls');
import {Confirmation} from 'Controls/popup';
import {ISelectionObject} from 'Controls/interface';
import {Control, IControlOptions} from 'UI/Base';

export default class BaseAction extends Control<IControlOptions> {
   validate(items: unknown[]|ISelectionObject): boolean {
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
}
