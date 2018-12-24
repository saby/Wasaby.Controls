define('Controls/List/interface/IGridControl', [
], function() {

   /**
    * Interface for Grid (table view).
    *
    * @interface Controls/List/interface/IGridControl
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/List/interface/IGridControl#stickyColumnsCount
    * @cfg {Number} Number of columns that will be fixed when scrolling horizontally.
    */

   /**
    * @name Controls/List/interface/IGridControl#ladderProperties
    * @cfg {Array.<String>} Array of fields that should be sticky.
    */

   /**
    * @typedef {Object} StickyColumn
    * @property {Number} [index] Index of the column for which sticking is calculated.
    * @property {String} [property] Name of the field for which sticking is calculated.
    */

   /**
    * @name Controls/List/interface/IGridControl#stickyColumn
    * @cfg {StickyColumn} Configuration for column's sticking.
    */

   /**
    * @name Controls/List/interface/IGridControl#rowSpacing
    * @cfg {String} Spacing between grid rows.
    * @variant S Small spacing.
    * @variant M Medium spacing.
    * @variant L Large spacing.
    * @variant XL Extra large spacing.
    */

   /**
    * @name Controls/List/interface/IGridControl#leftPadding
    * @cfg {String} Padding to the left border of the grid.
    * @variant S Small padding.
    * @variant M Medium padding.
    * @variant L Large padding.
    * @variant XL Extra large padding.
    */

   /**
    * @name Controls/List/interface/IGridControl#rightPadding
    * @cfg {String} Padding to the right border of the grid.
    * @variant S Small padding.
    * @variant M Medium padding.
    * @variant L Large padding.
    * @variant XL Extra large padding.
    */

   /**
    * @typedef {Object} HeaderCell Describer the header cell.
    * @property {String} [title] Text.
    * @property {String} [align] Horizontal text align (left|center|right).
    * @property {String} [valign] Vertical text align (top|center|bottom).
    * @property {Number} [colspan] Number of grouped cells in a row including the current one (>=2).
    * @property {Number} [rowspan] Number of grouped cells in a column including the current one (>=2).
    * @property {String} [template] Template for the header cell.
    */

   /**
    * @name Controls/List/interface/IGridControl#header
    * @cfg {Array.<Array.<HeaderCell>>} Describes list header.
    */

   /**
    * @typedef {Object} Column
    * @property {Number} [position] Position of a column in a table. If not set, position in the array is used instead.
    * @property {String} [displayProperty] Name of the field that will shown in the column by default.
    * @property {String} [template] Cell template.
    * @property {String} [resultTemplate] Cell template in results row.
    * @property {String} [align] Horizontal text align (left|center|right).
    * @property {String} [valign] Vertical text align (top|center|bottom).
    * @property {String|Number} [width] Column width (pixels/percent/auto).
    */

   /**
    * @name Controls/List/interface/IGridControl#columns
    * @cfg {Array.<Column>} Describes Grid's columns.
    */

   /**
    * @name Controls/List/interface/IGridControl#stickyHeader
    * @cfg {Boolean} Fix the table header.
    * @default true
    */

});
