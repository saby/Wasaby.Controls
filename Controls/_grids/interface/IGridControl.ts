/**
 * Interface for Grid (table view).
 *
 * @interface Controls/_list/interface/IGridControl
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/_list/interface/IGridControl#ladderProperties
 * @cfg {Array.<String>} Array of fields that should be sticky.
 * <a href="/materials/demo-ws4-grid-sticky">Example</a>
 * @example
 * Set ladderProperties and render item template through the ladderWrapper:
 * <pre>
 *    <div class="demoGrid">
 *       <Controls.Grid
 *          ...
 *          ladderProperties="{{ ['date'] }}">
 *          <ws:columns>
 *             <ws:Array>
 *                <ws:Object width="1fr">
 *                   <ws:template>
 *                      <ws:partial template="wml!Controls/_grids/Column">
 *                         <ws:contentTemplate>
 *                            <ws:partial template="{{ladderWrapper}}" ladderProperty="date">
 *                               <div class="demoGrid__date">
 *                                  {{itemData.item['date']}}
 *                               </div>
 *                            </ws:partial>
 *                         <ws:contentTemplate>
 *                      </ws:partial>
 *                   </ws:template>
 *                </ws:Object>
 *             </ws:Array>
 *          </ws:columns>
 *       </Controls.Grid>
 *    </div>
 * </pre>
 */

/**
 * @typedef {String} GridCellAlign
 * @variant left Align content to left side.
 * @variant center Align content to center.
 * @variant right Align content to right side.
 */

/**
 * @typedef {String} GridCellVAlign
 * @variant top Align content to top side.
 * @variant center Align content to center.
 * @variant bottom Align content to bottom side.
 */

/**
 * @typedef {Object} HeaderCell Describer grid's header cell.
 * @property {String} [caption] Header cell caption text.
 * @property {GridCellAlign} [align] Horizontal cell content align.
 * @property {GridCellVAlign} [valign] Vertical cell content align.
 * @property {String} [template] Template for the header cell.
 * @property {String} [sortingProperty] Property by which doing sorting.
 */

/**
 * @name Controls/_list/interface/IGridControl#header
 * @cfg {Array.<Array.<HeaderCell>>} Describes grid's header.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @remark
 * Base header content template for Controls/grid:View: "Controls/grid:HeaderContent".
 * @example
 * Add header text spacing for columns with money fields:
 * <pre>
 *    <ws:partial template="Controls/grid:HeaderContent" attr:class="controls-Grid__header-cell_spacing_money" colData="{{colData}}" />
 * </pre>
 */

/**
 * @typedef {Object} Column
 * @property {String} [width] Column width. Supported the value specified in pixels (for example, 4px) or percent (for example, 50%) and the value “auto”.
 * @property {String} [displayProperty] Name of the field that will shown in the column by default.
 * @property {String} [template] Template for cell rendering.
 * @property {String} [resultTemplate] Template for cell rendering in results row..
 * @property {GridCellAlign} [align] Horizontal cell content align.
 * @property {GridCellVAlign} [valign] Vertical cell content align.
 * @property {String} [stickyProperty] The name of the field used to sticking the column data.
 */

/**
 * @name Controls/_list/interface/IGridControl#columns
 * @cfg {Array.<Column>} Describes grid's columns.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @remark Before rendering, make sure that {@link Types/display:Collection Collection} contains required data, when the {@link Controls/_list/interface/IGridControl#columns columns} option changes. Call asynchronous 'reload' method before changing {@link Controls/_list/interface/IGridControl#columns columns} option, if necessary.
 */

/**
 * @name Controls/_list/interface/IGridControl#stickyHeader
 * @cfg {Boolean} Fix the table header.
 * <a href="/materials/demo-ws4-grid-sticky">Example</a>
 * @default true
 */

/**
 * @name Controls/_list/interface/IGridControl#rowSeparatorVisibility
 * @cfg {Boolean} Allows to visible or hide row separator.
 * <a href="/materials/demo-ws4-grid-base">Example</a>
 * @default false
 */
