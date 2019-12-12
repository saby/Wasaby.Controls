/**
 * Интерфейс для контролов, открывающих диалоговое окно выбора.
 * @interface Controls/interface/ISelectorCallback
 * @public
 * @author Капустин И.А.
 */

/**
 * @event Controls/interface/ISelectorCallback#selectorCallback Происходит при выборе элементов из справочника.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {RecordSet} initialItems Список выбранных элементов, перед открытием справочника.
 * @param {RecordSet} newItems Список выбранных элементов, после выбора из справочника.
 * @remark
 * Список выбранных элементов можно заменить, если из обработчика вернуть новую коллекцию.
 *
 * @example
 * В следующем примере создается Controls/lookup:Input и демонстрируется сценарий использования.
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       source="{{_source}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       on:selectorCallback="_selectorCallback()">
 *    </Controls.lookup:Input>
 * </pre>
 * JS:
 * <pre>
 *    _selectorCallback: function(initialItems, newItems) {
 *       let resultRS = newItems.clone();
 *       let countItems = resultRS.getCount();
 *
 *       if (countItems > 1) {
 *          resultRS.clear();
 *          resultRS.add(newItems.at(0));
 *       }
 *
 *       // Вернем новую коллекцию
 *       return resultRS;
 *    }
 * </pre>
 */

/*
 * @event Controls/_interface/ISelectorCallback#selectorCallback Occurs when selected items with selector.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject The event descriptor.
 * @param {RecordSet} initialItems List of selected items before opening the directory.
 * @param {RecordSet} newItemsThe list of selected items, after selecting from the directory.
 * @remark
 * The list of selected items can be replaced if a new collection is returned from the handler.
 *
 * @example
 * The following example creates Controls/lookup:Input and shows how to handle the event.
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       source="{{_source}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       on:selectorCallback="_selectorCallback()">
 *    </Controls.lookup:Input>
 * </pre>
 * JS:
 * <pre>
 *    _selectorCallback: function(initialItems, newItems) {
 *       let resultRS = newItems.clone();
 *       let countItems = resultRS.getCount();
 *
 *       if (countItems > 1) {
 *          resultRS.clear();
 *          resultRS.add(newItems.at(0));
 *       }
 *
 *       // We will return a new collection
 *       return resultRS;
 *    }
 * </pre>
 */
