import template = require('wml!Controls/_masterDetail/List/List');
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';

/**
 * Контрол используют в качестве контейнера для списочного контрола, который добавлен в шаблон {@link Controls/masterDetail/Base/options/master/ master}.
 * Он обеспечивает передачу текущей отмеченной записи в списке между списком и master'ом через всплывающее событие selectedMasterValueChanged.
 * @class Controls/_masterDetail/List
 * @extends UI/Base:Control
 * @public
 * @author Авраменко А.С.
 * @demo Controls-demo/MasterDetail/Demo
 */

/**
 * @event Происходит при смене выбранной записи.
 * @name Controls/_masterDetail/List#selectedMasterValueChanged
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} key  Ключ выбранного элемента.
 */

export default class List extends Control<IControlOptions>  {
   protected _template: TemplateFunction = template;
   protected _markedKey: string|number = null;

   protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
      this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
   }

   protected _markedKeyChangedHandler(event: SyntheticEvent, key: string|number): void {
      this._markedKey = key;
      this._notify('selectedMasterValueChanged', [key], {bubbling: true});
   }

   protected _itemsReadyCallback(items: RecordSet): void {
      if (items.getCount()) {
         this._markedKey = items.at(0).getKey();
      }

      if (typeof this._options.itemsReadyCallback === 'function') {
         this._options.itemsReadyCallback(items);
      }
   }
}
