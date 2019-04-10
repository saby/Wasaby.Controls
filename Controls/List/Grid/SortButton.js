define('Controls/List/Grid/SortButton', ['Controls/_grids/SortButton'], function(Control) {
/**
 * Graphical control element that used for changing sorting in Grid control
 *
 * @class Controls/grid:SortButton
 * @extends Core/Control
 * @mixes Controls/List/Grid/SortButton/Styles
 */
   /**
 * @name Controls/grid:SortButton#type
 * @cfg {String} Type of sorting.
 * @variant single Sorting by single field.
 * @variant multi Allows you to sort by multiple fields.
 */
   /**
 * @name Controls/grid:SortButton#property
 * @cfg {String} Sorting property.
 */
   return Control;
});
