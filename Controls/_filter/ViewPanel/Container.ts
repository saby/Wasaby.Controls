import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_filter/ViewPanel/Container';

/**
 * Контрол используют в качестве контейнера для {@link Controls/filter:ViewPanel}. Обеспечивает передачу параметров фильтрации между {@link Controls/filter:Controller} и {@link Controls/filter:ViewPanel}.
 * @class Controls/_filter/ViewPanel/Container
 * @extends Core/Control
 * @author Мельникова Е.А.
 *
 * @public
 */

export default class Container extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    /**
     * @event Происходит при изменении элементов.
     * @name Controls/_filter/ViewPanel/Container#filterItemsChanged
     * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
     * @param {Object} items Новые элементы.
     */
    protected _itemsChanged(event: Event, items: object[]): void {
       event.stopPropagation();
       this._notify('filterItemsChanged', [items], {bubbling: true});
    }

    protected _filterChanged(event: Event): void {
      event.stopPropagation();
   }
}
