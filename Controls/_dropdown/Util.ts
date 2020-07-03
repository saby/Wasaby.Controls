import rk = require('i18n!Controls');
import * as isEmpty from 'Core/helpers/Object/isEmpty';

export function prepareEmpty(emptyText) {
   if (emptyText) {
      return emptyText === true ? rk('Не выбрано') : emptyText;
   }
}

export function loadItems(controller, recievedState) {
   if (!recievedState || isEmpty(recievedState)) {
      return controller.loadItems();
   } else {
      controller.setItems(recievedState);
   }
}
