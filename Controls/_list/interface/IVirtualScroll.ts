/**
 * Interface for lists that can use virtual scroll.
 *
 * @interface Controls/_list/interface/IVirtualScroll
 * @public
 * @author Родионов Е.А.
 */

/**
 * @name Controls/_list/interface/IVirtualScroll#virtualScrolling
 * @cfg {Boolean} Turns on and off virtual scrolling in the list.
 * @remark
 * It is also necessary to set the view navigation to 'infinity'
 */

/**
 * @name Controls/_list/interface/IVirtualScroll#virtualPageSize
 * @cfg {Number} The size of the virtual page indicates maximum number of simultaneously displayed items in the list.
 * @default 100
 * @remark
 * The optimal value of the virtualPageSize option can be calculated by the formula: <b>virtualPageSize = M + (2 * S)</b>, where
 * <ul>
 *     <li>M - maximum number of items in the client area of the list;</li>
 *     <li>S - number of items that will be inserted/removed on reaching the end of displayed items({@link Controls/_list/interface/IVirtualScroll#virtualSegmentSize virtualSegmentSize}).</li>
 * </ul>
 * <b>Note for Controls/Grid:View and Controls/TreeGrid:View</b>: the value of the virtualPageSize should be less then 1000/total columns count in grid.
 */

/**
 * @name Controls/_list/interface/IVirtualScroll#virtualSegmentSize
 * @cfg {Number} Number of items that will be inserted/removed on reaching the end of displayed items.
 * @default 10
 */
