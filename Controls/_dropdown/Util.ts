import rk = require('i18n!Controls');
import Controller from 'Controls/_dropdown/_Controller';
import {ICrudPlus} from 'Types/source';
import {DropdownReceivedState} from 'Controls/_dropdown/BaseDropdown';

export function prepareEmpty(emptyText) {
   if (emptyText) {
      return emptyText === true ? rk('Не выбрано') : emptyText;
   }
}

export function loadItems(
    controller: Controller,
    receivedState: DropdownReceivedState,
    source: ICrudPlus
): void | Promise<DropdownReceivedState> {
   if (receivedState) {
      return controller.setItems(receivedState);
   } else if (source) {
      return controller.loadItems();
   }
}
