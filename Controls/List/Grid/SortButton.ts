import Control = require('Controls/_list/Grid/SortButton');

/**
 * Graphical control element that used for changing sorting in Grid control
 *
 * @class Controls/List/Grid/SortButton
 * @extends Core/Control
 * @mixes Controls/List/Grid/SortButton/Styles
 */
/**
 * @name Controls/List/Grid/SortButton#type
 * @cfg {String} Type of sorting.
 * @variant single Sorting by single field.
 * @variant multi Allows you to sort by multiple fields.
 */
/**
 * @name Controls/List/Grid/SortButton#property
 * @cfg {String} Sorting property.
 */
export = Control;