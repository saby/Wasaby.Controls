import rk = require('i18n!Controls');
import Controller from 'Controls/_dropdown/_Controller';
import {ICrudPlus} from 'Types/source';
import {SyntheticEvent} from 'Vdom/Vdom';

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
   if (receivedState) {
      return controller.setItems(receivedState);
   } else if (source) {
      return controller.loadItems();
   }
}

export function isLeftMouseButton(event: SyntheticEvent<MouseEvent>): boolean {
   return event.nativeEvent.button === 0;
}
