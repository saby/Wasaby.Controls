import Control = require('Controls/_list/Controllers/VirtualScroll');

/**
 * TODO: Сделать правильные экспорты, чтобы можно было и в js писать просто new VirtualScroll() и в TS файле использовать типы
 */
/**
 * Configuration object.
 *
 * @typedef VirtualScrollConfig
 * @type {object}
 * @property {number} virtualPageSize - The maximum number of elements that will be in the DOM at the same time.
 * @property {number} virtualSegmentSize - your name.
 */
/**
 * HTML container with elements.
 *
 * @typedef ItemsContainer
 * @type {Object}
 * @property {Array<HTMLElement>} children
 */
/**
 * Indexes of elements that should be mounted into the DOM.
 *
 * @remark The stop index is higher than the last item to show by one
 * @typedef ItemsIndexes
 * @type {Object}
 * @property {number} start - Index of the first element.
 * @property {number} stop - Index of the last element.
 */
/**
 * The size of the placeholders that should be displayed instead of the "excessive" items.
 *
 * @typedef PlaceholdersSizes
 * @type {Object}
 * @property {number} top
 * @property {number} bottom
 */
/**
 * @class Controls/List/Controllers/VirtualScroll
 * @author Rodionov E.A.
 * @public
 * */
/**
     * @constructor
     * @this  {VirtualScroll}
     * @param {VirtualScrollConfig} cfg
     */
/*
        * uDimension работает с window, для того чтобы протестировать функцию есть параметр isUnitTesting
        */
export = Control;