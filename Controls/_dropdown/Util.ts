import rk = require('i18n!Controls');
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import Controller from 'Controls/_dropdown/_Controller';
import {ICrudPlus} from 'Types/source';

export function prepareEmpty(emptyText) {
   if (emptyText) {
      return emptyText === true ? rk('Не выбрано') : emptyText;
   }
}

export function loadItems(
    controller: Controller,
    receivedState: unknown,
    source: ICrudPlus
): void | Promise<unknown> {
   if (receivedState && !isEmpty(receivedState)) {
      controller.setItems(receivedState);
   } else if (source) {
      return controller.loadItems();
   }
}
