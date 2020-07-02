import rk = require('i18n!Controls');
import * as isEmpty from 'Core/helpers/Object/isEmpty';

export function prepareEmpty(emptyText) {
   if (emptyText) {
      return emptyText === true ? rk('Не выбрано') : emptyText;
   }
}

export function loadItems(control, recievedState) {
   if (!recievedState || isEmpty(recievedState)) {
      return control._controller.loadItems();
   } else {
      control._controller.setItems(recievedState);
   }
}
