/**
 * Интерфейс для списков, которые поддерживают событие клика по элементу.
 * @interface Controls/_grid/interface/IItemClick
 * @public
 * @author Авраменко А.С.
 */

/**
 * @event Controls/_grid/interface/IItemClick#itemClick Происходит при клике на элемент списка.
 * @param {Vdom/Vdom:SyntheticEvent} event Объект события.
 * @param {Types/entity:Record} item Элемент, по которому кликнули.
 * @param {Object} nativeEvent Объект нативного события браузера.
 * @param {Number} columnIndex Индекс колонки по которой кликнули.
 */
